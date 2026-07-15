import type { AvailableMove } from "../../view/player-prompt.ts";
import type { AIStrategy, DecisionContext } from "../types.ts";
import { decisionFromMove } from "./move-args.ts";

/** A move is actionable if its inputSpec can be satisfied (no empty candidate lists). */
function isActionable(move: AvailableMove, ctx: DecisionContext): boolean {
  if (move.moveId === "useBlocker" && ctx.view.attackState?.redirectedByBlocker) return false;

  switch (move.inputSpec.type) {
    case "none":
      return true;
    case "selectCard":
      return move.inputSpec.candidates.length > 0;
    case "selectPair":
      return move.inputSpec.fromCandidates.length > 0 && move.inputSpec.toCandidates.length > 0;
    case "selectAbility":
      return move.inputSpec.candidates.length > 0;
    case "playCard":
      // A candidate is playable if it doesn't need an attach target, or has at
      // least one valid one. Empty `attachTargets: []` candidates are filtered
      // out by getPlayCardCandidates already, but defend in depth.
      return move.inputSpec.candidates.some(
        (c) => c.attachTargets === undefined || c.attachTargets.length > 0,
      );
  }
}

/**
 * Picks the first actionable move, preferring any meaningful action over
 * `passPhase`, and only choosing `concede` when nothing else is available.
 * The "smoke test" bot — runnable but not strong.
 */
export const firstLegalStrategy: AIStrategy = {
  name: "first-legal",
  decideAction(ctx) {
    const moves = ctx.prompt.availableMoves.filter((move) => isActionable(move, ctx));
    if (moves.length === 0) return { kind: "stuck", reason: "no actionable moves" };
    const meaningful = moves.filter((m) => m.moveId !== "concede" && m.moveId !== "passPhase");
    const passPhase = moves.find((m) => m.moveId === "passPhase");
    const concede = moves.find((m) => m.moveId === "concede");
    const pick = meaningful[0] ?? passPhase ?? concede ?? moves[0]!;
    return decisionFromMove(pick, {
      pickFromCandidates: (cands) => cands[0] ?? null,
      pickPair: (from, to) => {
        const f = from[0];
        const t = to[0];
        if (!f || !t) return null;
        return { from: f, to: t };
      },
    });
  },
};
