import type { MatchedCouncil, CouncilRole } from '../supabase/functions/postcode-lookup/logic';

export type { MatchedCouncil, CouncilRole };

// Pure helpers for postcode results. Kept free of the Supabase client so they can be
// unit-tested on any Node version.

export type PostcodeLookup =
  | { status: 'ok'; postcode: string; terminated: boolean; councils: MatchedCouncil[] }
  | { status: 'not_found'; postcode: string }
  | { status: 'no_match' | 'rate_limited' | 'unavailable' | 'invalid' };

/** What each tier of council is mainly responsible for, in plain words. */
export function roleSummary(role: CouncilRole): string {
  switch (role) {
    case 'county':
      return 'Schools, social care, roads and transport, libraries and waste disposal.';
    case 'district':
      return 'Bin collections, planning, housing, council tax and licensing.';
    default:
      return 'All local council services for this area.';
  }
}

export function roleLabel(role: CouncilRole): string {
  return role === 'county' ? 'County council' : role === 'district' ? 'District council' : 'Your council';
}

/** Read the edge function's reply into a typed result; anything unexpected is "unavailable". */
export function parseLookup(body: unknown): PostcodeLookup {
  const b = body as Record<string, unknown> | null;
  const status = b?.status;
  if (status === 'ok' && Array.isArray(b?.councils) && typeof b?.postcode === 'string') {
    return { status: 'ok', postcode: b.postcode, terminated: b.terminated === true, councils: b.councils as MatchedCouncil[] };
  }
  if (status === 'not_found' && typeof b?.postcode === 'string') return { status: 'not_found', postcode: b.postcode };
  if (status === 'no_match' || status === 'rate_limited' || status === 'invalid') return { status };
  return { status: 'unavailable' };
}
