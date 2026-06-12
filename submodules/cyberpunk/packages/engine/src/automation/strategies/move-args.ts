import type {
  AbilityCandidate,
  AvailableMove,
  PlayCardCandidate,
} from "../../view/player-prompt.ts";
import type { MoveDecision } from "../types.ts";
import type { MoveId } from "../../moves/index.ts";
import { assertNever } from "../util/assert-never.ts";

/**
 * Build a `MoveDecision` from an `AvailableMove` and a strategy-supplied
 * picker. Strategies pick which candidate(s) to use; this function knows how
 * each move's args are shaped from its `inputSpec`.
 *
 * The exhaustive switch on `MoveId` ensures that adding a new move requires a
 * deliberate decision about how a strategy supplies its args.
 */
export interface PlayCardPick {
  cardId: string;
  attachToId?: string;
}

export interface ArgPicker {
  pickFromCandidates(candidates: string[]): string | null;
  pickPair(fromCandidates: string[], toCandidates: string[]): { from: string; to: string } | null;
  pickAbility?(candidates: AbilityCandidate[]): AbilityCandidate | null;
  pickPlayCard?(candidates: PlayCardCandidate[]): PlayCardPick | null;
}

export function decisionFromMove(available: AvailableMove, picker: ArgPicker): MoveDecision {
  const { moveId, inputSpec } = available;
  switch (moveId) {
    case "playCard": {
      if (inputSpec.type !== "playCard") {
        return {
          kind: "stuck",
          reason: `playCard: expected playCard inputSpec, got ${inputSpec.type}`,
        };
      }
      if (inputSpec.candidates.length === 0) {
        return { kind: "stuck", reason: "playCard: no candidates" };
      }
      const pick = picker.pickPlayCard
        ? picker.pickPlayCard(inputSpec.candidates)
        : defaultPickPlayCard(inputSpec.candidates);
      if (!pick) return { kind: "stuck", reason: "playCard: no playable candidate" };
      const args: Record<string, unknown> = { cardId: pick.cardId };
      if (pick.attachToId !== undefined) args.attachToId = pick.attachToId;
      return { kind: "command", move: "playCard", args };
    }
    case "sellCard":
    case "callLegend":
    case "goSolo":
    case "attackRival":
    case "useBlocker":
    case "resolveCardToPlay": {
      if (inputSpec.type !== "selectCard") {
        return {
          kind: "stuck",
          reason: `${moveId}: expected selectCard inputSpec, got ${inputSpec.type}`,
        };
      }
      const cardId = picker.pickFromCandidates(inputSpec.candidates);
      if (!cardId) return { kind: "stuck", reason: `${moveId}: no candidates` };
      return { kind: "command", move: moveId, args: argsForCardMove(moveId, cardId) };
    }
    case "attackUnit": {
      if (inputSpec.type !== "selectPair") {
        return {
          kind: "stuck",
          reason: `attackUnit: expected selectPair inputSpec, got ${inputSpec.type}`,
        };
      }
      const pair = picker.pickPair(inputSpec.fromCandidates, inputSpec.toCandidates);
      if (!pair) return { kind: "stuck", reason: "attackUnit: no attacker/defender pair" };
      return {
        kind: "command",
        move: "attackUnit",
        args: { attackerId: pair.from, defenderId: pair.to },
      };
    }
    case "passPhase":
    case "concede":
    case "mulligan":
    case "keepHand":
    case "gainGig":
      return { kind: "command", move: moveId };
    case "resolveAttack":
      // `resolveAttack` advances the attack state machine. With no pending
      // choice, the typical caller wants `pass: true` (move from defensive →
      // resolve, or auto-resolve at the resolve step).
      return { kind: "command", move: "resolveAttack", args: { pass: true } };
    case "resolveCardToMove":
      return { kind: "command", move: "resolveCardToMove", args: { pass: true } };
    case "activateAbility": {
      if (inputSpec.type !== "selectAbility") {
        return {
          kind: "stuck",
          reason: `activateAbility: expected selectAbility inputSpec, got ${inputSpec.type}`,
        };
      }
      const pick = picker.pickAbility
        ? picker.pickAbility(inputSpec.candidates)
        : (inputSpec.candidates[0] ?? null);
      if (!pick) return { kind: "stuck", reason: "activateAbility: no candidates" };
      return {
        kind: "command",
        move: "activateAbility",
        args: { cardId: pick.cardId, abilityIndex: pick.abilityIndex },
      };
    }
    case "resolveSearchDeck":
      return { kind: "stuck", reason: "resolveSearchDeck must come from a resolver" };
    case "resolveDiscardFromHand":
      return { kind: "stuck", reason: "resolveDiscardFromHand must come from a resolver" };
    case "resolveAdjustGig":
      return { kind: "stuck", reason: "resolveAdjustGig must come from a resolver" };
    case "resolveStealGigs":
      return { kind: "stuck", reason: "resolveStealGigs must come from a resolver" };
    case "resolveTrigger":
      return { kind: "stuck", reason: "resolveTrigger must come from a resolver" };
    case "resolveEffectTarget":
      return { kind: "stuck", reason: "resolveEffectTarget must come from a resolver" };
    default:
      return assertNever(moveId, "MoveId in decisionFromMove");
  }
}

function argsForCardMove(moveId: MoveId, cardId: string): Record<string, unknown> {
  switch (moveId) {
    case "sellCard":
      return { cardId };
    case "callLegend":
      return { legendId: cardId };
    case "goSolo":
      return { cardId };
    case "attackRival":
      return { attackerId: cardId };
    case "useBlocker":
      return { blockerId: cardId };
    case "resolveCardToPlay":
      return { cardId };
    default:
      return { cardId };
  }
}

function defaultPickPlayCard(candidates: PlayCardCandidate[]): PlayCardPick | null {
  for (const c of candidates) {
    if (c.attachTargets === undefined) return { cardId: c.cardId };
    const target = c.attachTargets[0];
    if (target !== undefined) return { cardId: c.cardId, attachToId: target };
  }
  return null;
}
