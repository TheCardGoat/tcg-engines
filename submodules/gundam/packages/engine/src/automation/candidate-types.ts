import { assertNever } from "../utils/assert-never.ts";
import type { GundamMoveName } from "../gundam/moves/move-name.ts";
import type { DeckLookAnswer } from "../gundam/types.ts";

/**
 * Tagged-union type for every candidate action the Gundam bot might submit.
 *
 * Strategies consume this shape (not loose `{ move, args }` records) so that
 * a `switch (candidate.family)` can be exhaustive at the type level and
 * ranking code doesn't need `as` casts. The command converter below is the
 * single point where a candidate is rendered into the runtime's move +
 * input-args shape, so adding a new family is a two-step change: append a
 * union variant, then extend `candidateToCommand`.
 *
 * The `family` discriminator must stay in 1:1 sync with `GundamMoveName`
 * (the literal union of `gundamMoves` keys) — `commandToCandidate` enforces
 * this at compile time via `assertNever` on its dispatch switch, so adding
 * a move without adding a family (or vice versa) is a `tsc --noEmit`
 * failure rather than a silent runtime no-op.
 */
export type GundamBotCandidate =
  | {
      readonly family: "deployUnit";
      readonly cardId: string;
      readonly targets?: readonly string[];
    }
  | {
      readonly family: "deployBase";
      readonly cardId: string;
      readonly targets?: readonly string[];
    }
  | {
      readonly family: "playCommand";
      readonly cardId: string;
      readonly targets?: readonly string[];
    }
  | {
      readonly family: "assignPilot";
      readonly pilotId: string;
      readonly unitId: string;
    }
  | {
      readonly family: "playCommandAsPilot";
      readonly cardId: string;
      readonly unitId: string;
    }
  | {
      readonly family: "enterBattle";
      readonly attackerId: string;
      readonly target: string;
    }
  | {
      readonly family: "declareBlock";
      readonly blockerId: string;
    }
  | {
      readonly family: "activateAbility";
      readonly cardId: string;
      readonly effectIndex: number;
      readonly targets?: readonly string[];
    }
  | { readonly family: "passBlock" }
  | { readonly family: "passBattleAction" }
  | { readonly family: "passActionStep" }
  | { readonly family: "passTurn" }
  | { readonly family: "concede" }
  | { readonly family: "skipOpponentTurn" }
  | { readonly family: "dropOpponent" }
  | {
      readonly family: "resolveEffect";
      readonly targets?: readonly string[];
      readonly optionalAnswers?: Readonly<Record<number, boolean>>;
      readonly chooseOneAnswers?: Readonly<Record<number, number>>;
      readonly deckLookAnswers?: Readonly<Record<number, DeckLookAnswer>>;
      readonly pendingEffectId?: string;
    }
  | {
      readonly family: "chooseFirstPlayer";
      readonly playerId: string;
    }
  | {
      readonly family: "alterHand";
      readonly wantsRedraw: boolean;
    }
  | {
      readonly family: "discardToHandLimit";
      readonly cardIds: readonly string[];
    };

export type GundamBotCandidateFamily = GundamBotCandidate["family"];

/**
 * Compile-time witness that the candidate-family discriminator is in
 * exact 1:1 correspondence with `GundamMoveName`. If `gundamMoves` ever
 * drops a move whose family is still in the candidate union, or the
 * union grows a `family` that isn't a move, this fails to typecheck at
 * `tsc --noEmit`. Uses the standard TypeScript equality-witness trick
 * (a contravariant function-arg comparison) so the check survives a
 * lint pass that would otherwise flag a pair of `extends` clauses as
 * a duplicated intersection.
 */
type ExactlyEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : never;
const _familyMoveNameParity: ExactlyEqual<GundamBotCandidateFamily, GundamMoveName> = true;
void _familyMoveNameParity;

/**
 * Render a candidate as the move-name + args tuple that
 * `runtime.executeCommand` consumes. This is the only place that maps the
 * bot's typed view back to the engine's typed move API; the return is
 * branded as `GundamMoveName` so envelope construction stays type-safe.
 */
export function candidateToCommand(candidate: GundamBotCandidate): {
  readonly move: GundamMoveName;
  readonly args: Record<string, unknown>;
} {
  switch (candidate.family) {
    case "deployUnit":
    case "deployBase":
    case "playCommand": {
      const args: Record<string, unknown> = { cardId: candidate.cardId };
      if (candidate.targets !== undefined) args.targets = candidate.targets;
      return { move: candidate.family, args };
    }
    case "assignPilot":
      return {
        move: "assignPilot",
        args: { pilotId: candidate.pilotId, unitId: candidate.unitId },
      };
    case "playCommandAsPilot":
      return {
        move: "playCommandAsPilot",
        args: { cardId: candidate.cardId, unitId: candidate.unitId },
      };
    case "enterBattle":
      return {
        move: "enterBattle",
        args: { attackerId: candidate.attackerId, target: candidate.target },
      };
    case "declareBlock":
      return { move: "declareBlock", args: { blockerId: candidate.blockerId } };
    case "activateAbility": {
      const args: Record<string, unknown> = {
        cardId: candidate.cardId,
        effectIndex: candidate.effectIndex,
      };
      if (candidate.targets !== undefined) args.targets = candidate.targets;
      return { move: "activateAbility", args };
    }
    case "passBlock":
    case "passBattleAction":
    case "passActionStep":
    case "passTurn":
    case "concede":
    case "skipOpponentTurn":
    case "dropOpponent":
      return { move: candidate.family, args: {} };
    case "resolveEffect": {
      const args: Record<string, unknown> = {};
      if (candidate.targets !== undefined) args.targets = candidate.targets;
      if (candidate.optionalAnswers !== undefined) args.optionalAnswers = candidate.optionalAnswers;
      if (candidate.chooseOneAnswers !== undefined)
        args.chooseOneAnswers = candidate.chooseOneAnswers;
      if (candidate.deckLookAnswers !== undefined) args.deckLookAnswers = candidate.deckLookAnswers;
      if (candidate.pendingEffectId !== undefined) args.pendingEffectId = candidate.pendingEffectId;
      return { move: "resolveEffect", args };
    }
    case "chooseFirstPlayer":
      return { move: "chooseFirstPlayer", args: { playerId: candidate.playerId } };
    case "alterHand":
      return { move: "alterHand", args: { wantsRedraw: candidate.wantsRedraw } };
    case "discardToHandLimit":
      return { move: "discardToHandLimit", args: { cardIds: candidate.cardIds } };
  }
}

/**
 * Build a typed candidate from the move name + the partial-input the
 * enumerator accumulated while walking `describeProcedure`. Returns
 * `null` only when the partial input is incomplete for the requested
 * move (e.g. caller seeded `chooseFirstPlayer` without a `playerId`).
 * The `default` branch uses `assertNever` so adding a `GundamMoveName`
 * without extending this dispatch is a compile error.
 */
export function commandToCandidate(
  moveName: GundamMoveName,
  partialInput: Readonly<Record<string, unknown>>,
): GundamBotCandidate | null {
  switch (moveName) {
    case "deployUnit":
    case "deployBase":
    case "playCommand": {
      const cardId = partialInput.cardId;
      if (typeof cardId !== "string") return null;
      const targets = partialInput.targets;
      return {
        family: moveName,
        cardId,
        ...(Array.isArray(targets) ? { targets: targets as readonly string[] } : {}),
      };
    }
    case "assignPilot": {
      const pilotId = partialInput.pilotId;
      const unitId = partialInput.unitId;
      if (typeof pilotId !== "string" || typeof unitId !== "string") return null;
      return { family: "assignPilot", pilotId, unitId };
    }
    case "playCommandAsPilot": {
      const cardId = partialInput.cardId;
      const unitId = partialInput.unitId;
      if (typeof cardId !== "string" || typeof unitId !== "string") return null;
      return { family: "playCommandAsPilot", cardId, unitId };
    }
    case "enterBattle": {
      const attackerId = partialInput.attackerId;
      const target = partialInput.target;
      if (typeof attackerId !== "string" || typeof target !== "string") return null;
      return { family: "enterBattle", attackerId, target };
    }
    case "declareBlock": {
      const blockerId = partialInput.blockerId;
      if (typeof blockerId !== "string") return null;
      return { family: "declareBlock", blockerId };
    }
    case "activateAbility": {
      const cardId = partialInput.cardId;
      const effectIndex = partialInput.effectIndex;
      if (typeof cardId !== "string" || typeof effectIndex !== "number") return null;
      const targets = partialInput.targets;
      return {
        family: "activateAbility",
        cardId,
        effectIndex,
        ...(Array.isArray(targets) ? { targets: targets as readonly string[] } : {}),
      };
    }
    case "passBlock":
    case "passBattleAction":
    case "passActionStep":
    case "passTurn":
    case "concede":
    case "skipOpponentTurn":
    case "dropOpponent":
      return { family: moveName };
    case "resolveEffect": {
      const targets = partialInput.targets;
      const optionalAnswers = partialInput.optionalAnswers;
      const chooseOneAnswers = partialInput.chooseOneAnswers;
      const deckLookAnswers = partialInput.deckLookAnswers;
      const pendingEffectId = partialInput.pendingEffectId;
      return {
        family: "resolveEffect",
        ...(Array.isArray(targets) ? { targets: targets as readonly string[] } : {}),
        ...(optionalAnswers && typeof optionalAnswers === "object"
          ? { optionalAnswers: optionalAnswers as Readonly<Record<number, boolean>> }
          : {}),
        ...(chooseOneAnswers && typeof chooseOneAnswers === "object"
          ? { chooseOneAnswers: chooseOneAnswers as Readonly<Record<number, number>> }
          : {}),
        ...(deckLookAnswers && typeof deckLookAnswers === "object"
          ? {
              deckLookAnswers: deckLookAnswers as Readonly<Record<number, DeckLookAnswer>>,
            }
          : {}),
        ...(typeof pendingEffectId === "string" ? { pendingEffectId } : {}),
      };
    }
    case "chooseFirstPlayer": {
      const playerId = partialInput.playerId;
      if (typeof playerId !== "string") return null;
      return { family: "chooseFirstPlayer", playerId };
    }
    case "alterHand": {
      const wantsRedraw = partialInput.wantsRedraw;
      if (typeof wantsRedraw !== "boolean") return null;
      return { family: "alterHand", wantsRedraw };
    }
    case "discardToHandLimit": {
      const cardIds = partialInput.cardIds;
      if (!Array.isArray(cardIds)) return null;
      return { family: "discardToHandLimit", cardIds: cardIds as readonly string[] };
    }
    default:
      return assertNever(moveName, "commandToCandidate");
  }
}
