export type ReviewDraft = {
  rating: number;
  serviceId: string;
  title: string;
  body: string;
  expiresAt: number;
};
export const draftKey = (council: string) => `rylc_review_draft_v1:${council}`;
export function parseDraft(
  raw: string | null,
  now = Date.now(),
): ReviewDraft | null {
  try {
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (
      v.expiresAt <= now ||
      !Number.isFinite(v.expiresAt) ||
      !Number.isInteger(v.rating) ||
      v.rating < 0 ||
      v.rating > 5 ||
      typeof v.serviceId !== "string" ||
      typeof v.title !== "string" ||
      typeof v.body !== "string" ||
      v.title.length > 120 ||
      v.body.length > 2000
    )
      return null;
    return v;
  } catch {
    return null;
  }
}
