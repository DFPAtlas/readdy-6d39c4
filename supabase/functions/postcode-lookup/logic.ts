// Pure postcode-lookup logic shared by the edge function (Deno) and unit tests (Node).
// No runtime-specific imports here.

export type CouncilRole = 'county' | 'district' | 'unitary';

export type AreaCodes = {
  /** GSS code of the district or single-tier authority (always present for a live postcode). */
  district: string;
  /** GSS code of the county council in two-tier areas, otherwise null. */
  county: string | null;
};

export type PostcodesIoResult = {
  postcode?: string;
  codes?: {
    admin_district?: string | null;
    admin_county?: string | null;
  } | null;
};

const POSTCODE_RE = /^(GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/;
const GSS_RE = /^[ENSW]\d{8}$/;

/** Uppercase, strip spaces; returns null unless it is a well-formed UK postcode. */
export function normalisePostcode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.toUpperCase().replace(/\s+/g, '');
  return POSTCODE_RE.test(value) ? value : null;
}

/** "SW1A1AA" -> "SW1A 1AA" */
export function formatPostcode(normalised: string): string {
  return normalised.length > 3 ? `${normalised.slice(0, -3)} ${normalised.slice(-3)}` : normalised;
}

/**
 * ONS uses pseudo codes ending in 99999999 (e.g. E99999999) where a postcode has no
 * county council. Those, and anything not shaped like a GSS code, are ignored.
 */
function realGss(code: string | null | undefined): string | null {
  if (!code || !GSS_RE.test(code) || code.endsWith('99999999')) return null;
  return code;
}

export function areaCodesFrom(result: PostcodesIoResult | null | undefined): AreaCodes | null {
  const district = realGss(result?.codes?.admin_district);
  if (!district) return null;
  return { district, county: realGss(result?.codes?.admin_county) };
}

export type CouncilRow = {
  slug: string;
  name: string;
  council_type: string;
  region: string | null;
  official_code: string | null;
  logo_url: string | null;
  logo_type: string | null;
};

export type MatchedCouncil = Omit<CouncilRow, 'official_code'> & { role: CouncilRole };

/**
 * Orders matched councils county first, then district; single-tier areas get one
 * council with role "unitary". Rows whose code is not in the area are dropped.
 */
export function matchCouncils(area: AreaCodes, rows: CouncilRow[]): MatchedCouncil[] {
  const byCode = new Map(rows.filter(r => r.official_code).map(r => [r.official_code as string, r]));
  const strip = ({ official_code: _code, ...rest }: CouncilRow) => rest;
  const out: MatchedCouncil[] = [];
  const county = area.county ? byCode.get(area.county) : undefined;
  const district = byCode.get(area.district);
  if (county) out.push({ ...strip(county), role: 'county' });
  if (district) out.push({ ...strip(district), role: area.county ? 'district' : 'unitary' });
  return out;
}
