/** Human-friendly reference derived from the row id, e.g. "MA-1A2B3C4D". */
export const referenceFor = (id: string) => `MA-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
