import type { MoveId } from "../../moves/index.ts";
import type { AvailableMove, PlayCardCandidate } from "../../view/player-prompt.ts";
import type { AIStrategy, DecisionContext, MoveDecision } from "../types.ts";
import { defaultChoiceResolvers } from "../resolvers/index.ts";
import { decisionFromMove, type PlayCardPick } from "./move-args.ts";

// Action prompts only. Pending-choice resolver prompts are handled by the
// explicit shared resolver map on each forced strategy below.
const PROGRESS_FALLBACK_ORDER: readonly MoveId[] = [
  "keepHand",
  "resolveAttack",
  "resolveCardToMove",
  "passPhase",
];

function firstPlayableCard(candidates: PlayCardCandidate[]): PlayCardPick | null {
  for (const candidate of candidates) {
    if (candidate.attachTargets === undefined) return { cardId: candidate.cardId };
    const attachToId = candidate.attachTargets[0];
    if (attachToId) return { cardId: candidate.cardId, attachToId };
  }
  return null;
}

function decisionFor(move: AvailableMove): MoveDecision {
  return decisionFromMove(move, {
    pickFromCandidates: (candidates) => candidates[0] ?? null,
    pickPair: (fromCandidates, toCandidates) => {
      const from = fromCandidates[0];
      const to = toCandidates[0];
      return from && to ? { from, to } : null;
    },
    pickAbility: (candidates) => candidates[0] ?? null,
    pickPlayCard: firstPlayableCard,
  });
}

function pickByOrder(ctx: DecisionContext, order: readonly MoveId[]): MoveDecision {
  for (const moveId of order) {
    const move = ctx.prompt.availableMoves.find((candidate) => candidate.moveId === moveId);
    if (!move) continue;
    const decision = decisionFor(move);
    if (decision.kind === "command") return decision;
  }

  return { kind: "stuck", reason: "forced strategy found no matching move" };
}

function createForcedMoveStrategy(name: string, preferred: readonly MoveId[]): AIStrategy {
  return {
    name,
    decideChoice: defaultChoiceResolvers,
    decideAction(ctx) {
      return pickByOrder(ctx, [...preferred, ...PROGRESS_FALLBACK_ORDER]);
    },
  };
}

export const passOnlyStrategy: AIStrategy = createForcedMoveStrategy("pass-only", [
  "passPhase",
  "keepHand",
]);

export const attackUnitOnlyStrategy: AIStrategy = createForcedMoveStrategy("attack-unit-only", [
  "attackUnit",
]);

export const callLegendOnlyStrategy: AIStrategy = createForcedMoveStrategy("call-legend-only", [
  "callLegend",
]);
