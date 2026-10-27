export type CouncilLogoType = 'logo' | 'coat_of_arms';

const COUNCIL_TYPE_LABELS: Record<string, string> = {
  county: 'County Council',
  district: 'District Council',
  unitary: 'Unitary Authority',
  metropolitan: 'Metropolitan District',
  london_borough: 'London Borough',
  scottish_council: 'Scottish Council',
  welsh_council: 'Welsh Principal Council',
  ni_district: 'NI District Council',
};

export function formatCouncilType(type: string | null | undefined): string {
  if (!type) return 'Council';
  return COUNCIL_TYPE_LABELS[type] ?? 'Council';
}

const COMMONS_FILE_PATH = 'https://commons.wikimedia.org/wiki/Special:FilePath/';

/**
 * Council emblems are Wikimedia Commons Special:FilePath URLs. Commons serves a
 * resized PNG when given a width, which keeps large SVG/PNG originals off the page.
 * Anything that is not a Commons file path is rejected so the page never loads an
 * arbitrary image URL from the database.
 */
export function councilLogoSrc(logoUrl: string | null | undefined, width: number): string | null {
  if (!logoUrl || !logoUrl.startsWith(COMMONS_FILE_PATH)) return null;
  const file = logoUrl.slice(COMMONS_FILE_PATH.length);
  if (!file || /[\s?#"'<>]/.test(file)) return null;
  const px = Math.max(16, Math.min(512, Math.round(width)));
  return `${COMMONS_FILE_PATH}${file}?width=${px}`;
}

export function councilInitials(name: string): string {
  const words = name
    .replace(/&/g, ' ')
    .split(/\s+/)
    .filter(w => w && !/^(of|and|the|upon|on|with|city|borough|county|district|council|metropolitan|london|royal|corporation)$/i.test(w));
  const letters = words.slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  return letters || name.slice(0, 1).toUpperCase() || '?';
}
