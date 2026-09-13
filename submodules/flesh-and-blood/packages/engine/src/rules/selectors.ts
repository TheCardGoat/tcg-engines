import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";

/**
 * Count arena permanents a player controls whose canonical id matches the
 * given token id (e.g. `"token:runechant"` for Runechant tokens). Single-pass
 * over the arena zone — no snapshot materialisation.
 *
 * CR 8.3.27 rune-gate: "If you control Runechants >= this's cost, you may
 * play it from your banished zone without paying its cost."
 */
export function countControlledTokens(
  state: FabRulesSnapshot,
  playerId: string,
  canonicalId: string,
): number {
  const arena = state.containers.zonesByPlayerId[playerId]?.arena;
  if (!arena) return 0;
  // create-token uses `token:<slug>`; catalog seatings may use the set
  // canonical id (e.g. ARC112 Runechant). Match both shapes.
  const slug = canonicalId.startsWith("token:") ? canonicalId.slice("token:".length) : null;
  let count = 0;
  for (const instanceId of arena) {
    const id = state.objects[instanceId]?.canonicalId;
    if (!id) continue;
    if (id === canonicalId) {
      count += 1;
      continue;
    }
    if (slug) {
      if (id === `token:${slug}`) {
        count += 1;
        continue;
      }
      const def = state.cardDefinitions[id];
      if (def?.slug === slug) count += 1;
    }
  }
  return count;
}
