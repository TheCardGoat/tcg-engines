import type { DeckMetadataFacet } from "./types.js";

/** Stable ordering and de-duplication for opaque game-owned color values. */
export function normalizeMetadataColors(colors: Iterable<string>): string[] {
  return [...new Set([...colors].map((color) => color.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/**
 * Every color-capable game exposes the same two analytical questions while
 * retaining its own vocabulary in the adapter and UI configuration.
 */
export function buildColorMetadataFacets(colors: Iterable<string>): DeckMetadataFacet[] {
  const normalized = normalizeMetadataColors(colors);
  if (normalized.length === 0) return [];

  return [
    ...normalized.map((color) => ({
      type: "color",
      key: color,
      label: color,
      colors: [color],
    })),
    {
      type: "color-combination",
      key: normalized.join("+"),
      label: normalized.join(" / "),
      colors: normalized,
    },
  ];
}

export function sortMetadataFacets(facets: Iterable<DeckMetadataFacet>): DeckMetadataFacet[] {
  return [...facets].sort(
    (left, right) =>
      left.type.localeCompare(right.type) ||
      left.key.localeCompare(right.key) ||
      left.label.localeCompare(right.label),
  );
}

/** Return the first three distinct members of the first populated identity type in facet order. */
export function projectDeckIdentityMembers<T extends { cardId: string }>(
  facets: readonly { type: string; members?: readonly T[] }[],
): T[] {
  const identityType = facets.find((facet) => facet.members?.length)?.type;
  if (!identityType) return [];
  const members = facets
    .filter((facet) => facet.type === identityType)
    .flatMap((facet) => facet.members ?? []);
  return [...new Map(members.map((member) => [member.cardId, member])).values()].slice(0, 3);
}
