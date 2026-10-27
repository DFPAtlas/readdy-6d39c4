export const serviceAliases: Record<string, string> = {
  waste: "waste-recycling",
  education: "education-schools",
  highways: "highways-roads",
  fire: "fire-rescue",
  library: "libraries",
};
export const canonicalService = (slug: string) => serviceAliases[slug] || slug;
