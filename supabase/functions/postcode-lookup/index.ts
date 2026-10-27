// Postcode -> council lookup.
// The browser sends the postcode here; this function asks postcodes.io (ONS data)
// for the area codes and returns the matching councils. Visitors' IP addresses never
// reach postcodes.io, and postcodes are neither stored nor logged.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  areaCodesFrom,
  formatPostcode,
  matchCouncils,
  normalisePostcode,
  type CouncilRow,
  type PostcodesIoResult,
} from './logic.ts';

const POSTCODES_IO = 'https://api.postcodes.io';
const RATE_LIMIT = 30; // requests per IP per minute, per function instance (best effort)
const hits = new Map<string, { count: number; reset: number }>();

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json', ...extra },
  });
}

function limited(req: Request): boolean {
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

async function getJson(path: string): Promise<{ status: number; result: unknown }> {
  const res = await fetch(`${POSTCODES_IO}${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });
  if (res.status === 404) return { status: 404, result: null };
  if (!res.ok) throw new Error(`postcodes.io ${res.status}`);
  const body = await res.json();
  return { status: res.status, result: body?.result ?? null };
}

/** Live postcode, or for a terminated one the nearest live postcode to where it was. */
async function resolve(postcode: string): Promise<{ result: PostcodesIoResult | null; terminated: boolean }> {
  const live = await getJson(`/postcodes/${postcode}`);
  if (live.status !== 404) return { result: live.result as PostcodesIoResult, terminated: false };

  const old = await getJson(`/terminated_postcodes/${postcode}`);
  const t = old.result as { longitude?: number; latitude?: number } | null;
  if (old.status === 404 || typeof t?.longitude !== 'number' || typeof t?.latitude !== 'number') {
    return { result: null, terminated: false };
  }
  const near = await getJson(`/postcodes?lon=${t.longitude}&lat=${t.latitude}&limit=1&radius=2000`);
  const first = Array.isArray(near.result) ? (near.result[0] as PostcodesIoResult) : null;
  return { result: first ?? null, terminated: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ status: 'error', message: 'Use POST.' }, 405);
  if (limited(req)) return json({ status: 'rate_limited' }, 429, { 'Retry-After': '60' });

  let raw: unknown;
  try {
    raw = (await req.json())?.postcode;
  } catch {
    raw = null;
  }
  const postcode = normalisePostcode(raw);
  if (!postcode) return json({ status: 'invalid' }, 400);

  try {
    const { result, terminated } = await resolve(postcode);
    const area = areaCodesFrom(result);
    if (!area) return json({ status: 'not_found', postcode: formatPostcode(postcode) });

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      auth: { persistSession: false },
    });
    const codes = [area.district, area.county].filter(Boolean) as string[];
    const { data, error } = await supabase
      .from('councils')
      .select('slug,name,council_type,region,official_code,logo_url,logo_type')
      .in('official_code', codes);
    if (error) throw new Error('council query failed');

    const councils = matchCouncils(area, (data ?? []) as CouncilRow[]);
    return json(
      {
        status: councils.length ? 'ok' : 'no_match',
        postcode: formatPostcode(postcode),
        terminated,
        councils,
      },
    );
  } catch {
    // Deliberately no postcode in logs.
    console.error('postcode-lookup failed');
    return json({ status: 'error' }, 502);
  }
});
