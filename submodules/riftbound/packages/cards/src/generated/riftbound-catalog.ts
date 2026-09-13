import type { RiftboundCatalog } from "@tcg/riftbound-types";

/**
 * Deterministic repository-owned fallback until the authenticated generator
 * replaces this module with a catalog import. It deliberately makes no source
 * claim: populated catalogs must carry their validated official provenance.
 */
export const riftboundCatalog: RiftboundCatalog = {
  schemaVersion: 1,
  game: "riftbound",
  provenance: null,
  sets: [],
  cards: [],
};
