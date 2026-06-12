import type { AIStrategy, DecisionContext, MoveDecision } from "../types.ts";
import type { AvailableMove } from "../../view/player-prompt.ts";
import { decisionFromMove } from "./move-args.ts";

/**
 * Uniformly samples a legal move and uniformly samples its arguments from the
 * inputSpec candidates. Uses `ctx.rng` so that match seeds reproduce play.
 *
 * Useful as a fuzz/property-test opponent: the harness running random vs
 * random across many seeds is the cheapest way to surface engine bugs.
 */
export const randomStrategy: AIStrategy = {
  name: "random",
  decideAction(ctx) {
    return pickRandomAction(ctx);
  },
};

function pickRandomAction(ctx: DecisionContext): MoveDecision {
  const moves = ctx.prompt.availableMoves;
  if (moves.length === 0) return { kind: "stuck", reason: "no available moves" };

  // Concede is always legal but never a useful choice for a random opponent —
  // sample from non-concede moves first, fall back to concede only when it's
  // the sole remaining option.
  const interesting = moves.filter((m) => m.moveId !== "concede");
  const pool = interesting.length > 0 ? interesting : moves;

  // Try moves in random order, accept the first one that yields a usable
  // command. This avoids getting stuck on a "selectCard with no candidates"
  // when other moves are available.
  const order = shuffled(pool, ctx.rng);
  for (const move of order) {
    const decision = decisionFromMove(move, {
      pickFromCandidates: (cands) =>
        cands.length === 0 ? null : cands[Math.floor(ctx.rng() * cands.length)]!,
      pickPair: (from, to) => {
        if (from.length === 0 || to.length === 0) return null;
        return {
          from: from[Math.floor(ctx.rng() * from.length)]!,
          to: to[Math.floor(ctx.rng() * to.length)]!,
        };
      },
      pickAbility: (cands) =>
        cands.length === 0 ? null : cands[Math.floor(ctx.rng() * cands.length)]!,
      pickPlayCard: (cands) => {
        if (cands.length === 0) return null;
        const c = cands[Math.floor(ctx.rng() * cands.length)]!;
        if (c.attachTargets === undefined) return { cardId: c.cardId };
        if (c.attachTargets.length === 0) return null;
        const target = c.attachTargets[Math.floor(ctx.rng() * c.attachTargets.length)]!;
        return { cardId: c.cardId, attachToId: target };
      },
    });
    if (decision.kind === "command") return decision;
  }

  // If every move was stuck, surface that to the driver.
  return { kind: "stuck", reason: "random strategy could not build args for any available move" };
}

function shuffled<T>(items: readonly T[], rng: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export function _internalsForTest() {
  return { pickRandomAction, shuffled };
}

// Re-typed for external strategy consumers that want to compose:
export type { AvailableMove };
