import type { PlayerId } from "#core";

/**
 * Adds `amount` to a player's lore counter, mirroring the inline
 * `ctx.G.lore[pid] = Number(ctx.G.lore[pid] ?? 0) + n` pattern used in
 * challenge.ts, quest.ts, and pass-turn.ts.
 *
 * Does NOT consult `cant-gain-lore` restrictions — callers that need that
 * check (e.g. quest.ts) should compute the effective amount first. This keeps
 * the helper a pure setter with no hidden behavior.
 */
export function gainLore(
  ctx: { G: { lore: Record<PlayerId, number> } },
  playerId: PlayerId,
  amount: number,
): void {
  if (amount <= 0) {
    return;
  }
  ctx.G.lore[playerId] = Number(ctx.G.lore[playerId] ?? 0) + amount;
}
