import { isSupabaseConfigured, supabase } from './supabase/client';
import { normalisePostcode, validPostcode } from './navigation';
import { parseLookup, type PostcodeLookup } from './postcode-format';

export * from './postcode-format';

export async function lookupPostcode(raw: string): Promise<PostcodeLookup> {
  if (!validPostcode(raw)) return { status: 'invalid' };
  if (!isSupabaseConfigured) return { status: 'unavailable' };
  const { data, error } = await supabase.functions.invoke('postcode-lookup', {
    body: { postcode: normalisePostcode(raw) },
  });
  if (error) {
    // Non-2xx replies still carry the JSON body on the error's response.
    const response = (error as { context?: Response }).context;
    if (response && typeof response.json === 'function') {
      try {
        return parseLookup(await response.json());
      } catch {
        /* fall through */
      }
    }
    return { status: 'unavailable' };
  }
  return parseLookup(data);
}
