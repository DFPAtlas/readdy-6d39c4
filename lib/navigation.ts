export const councilHref = (slug: string) =>
  `/council-view?council=${encodeURIComponent(slug)}`;
export const reviewHref = (slug: string, service?: string) =>
  `/write-review?council=${encodeURIComponent(slug)}${service ? `&service=${encodeURIComponent(service)}` : ""}`;
export const serviceHref = (slug: string, service: string) =>
  `/council-service?council=${encodeURIComponent(slug)}&service=${encodeURIComponent(service)}`;

/** Accept only same-site absolute paths; never pass user input directly to router.push. */
export function safeNext(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(value)
  )
    return "/account";
  try {
    const url = new URL(value, "https://local.invalid");
    return url.origin === "https://local.invalid"
      ? `${url.pathname}${url.search}${url.hash}`
      : "/account";
  } catch {
    return "/account";
  }
}

export const normalisePostcode = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");
export const validPostcode = (value: string) =>
  /^(GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/.test(normalisePostcode(value));
export const normaliseAuthorityName = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
