/**
 * Single source of truth for the per-move "click → input shape" mapping.
 *
 * The UI's multi-step picker (`multi-game-simulator/src/games/gundam/.../interaction.ts`) and the
 * bot's headless candidate enumerator (`candidate-enumerator.ts`) both
 * need to translate a user's primary card click and subsequent
 * `selectTarget` steps into the partial-input keys the move's `validate`
 * / `execute` actually read. Historically this lived in two places —
 * `seedForCard`/`keyForStep` on the sim side and `seedForPrimaryCard`/
 * `keyForSelectTarget` on the engine side — which meant a move's input
 * shape could change in the engine without the UI noticing (or vice
 * versa) and the divergence would only surface as a runtime "Unknown
 * field" rejection.
 *
 * `MOVE_BINDINGS` is keyed on `GundamMoveName` so omitting a binding for
 * a freshly registered move is a `tsc --noEmit` failure rather than a
 * silent fallthrough. Adding a move is now a two-step change: append it
 * to `gundamMoves` and add an entry here. The UI re-exports the helpers
 * below, so a binding update propagates to both surfaces in one commit.
 */

import type { MoveStepOption } from "../types/move-types.ts";
import type { GundamMoveName } from "../gundam/moves/move-name.ts";

export type SelectTargetStep = Extract<MoveStepOption, { kind: "selectTarget" }>;

export interface SelectTargetBinding {
  readonly key: string;
  readonly multi: boolean;
}

export interface MoveBinding {
  /**
   * Build the initial partial-input the UI seeds when the player clicks a
   * card that's a candidate for this move (or that the bot's enumerator
   * uses when fanning out across `selectableCardIds`). Different moves
   * name the "primary card" input differently — `enterBattle` reads it
   * as `attackerId`, `assignPilot` as `pilotId`, etc.
   */
  readonly seedPrimaryCard: (cardId: string) => Record<string, unknown>;
  /**
   * Given a `selectTarget` step the move's `describeProcedure` emitted,
   * return the partial-input key the user's selection should be stored
   * under (and whether the slot is multi-valued). Branching on
   * `step.role` lets a single move have multiple distinct target keys
   * (e.g. `assignPilot` accepts both the pilot card and the unit card).
   */
  readonly keyForSelectTarget: (step: SelectTargetStep) => SelectTargetBinding;
}

const seedAsCardId: MoveBinding["seedPrimaryCard"] = (cardId) => ({ cardId });

const genericTargetKey = (step: SelectTargetStep): SelectTargetBinding => {
  const multi = step.maxTargets > 1;
  if (multi) return { key: "targets", multi: true };
  if (step.role === "target" || step.role === "attackTarget") {
    return { key: "target", multi: false };
  }
  return { key: `${step.role}Id`, multi: false };
};

// `targets` is always an array slot in the move's input shape (see
// `commandToCandidate`, which only accepts `Array.isArray(targets)`).
// Always report `multi: true` so the enumerator's multi-select branch
// fires and the UI's `pending.provide` wraps the picked id in an array
// — even when `maxTargets === 1`. Reporting `multi: false` here would
// silently drop a single-target selection at the candidate boundary.
const targetsMulti = (_step: SelectTargetStep): SelectTargetBinding => ({
  key: "targets",
  multi: true,
});

export const MOVE_BINDINGS: Readonly<Record<GundamMoveName, MoveBinding>> = {
  // Setup moves: no card-driven primary input (UI uses dedicated
  // buttons), so the seed is a generic `cardId` fallback for symmetry
  // and `keyForSelectTarget` defers to the generic role-keyed mapping.
  chooseFirstPlayer: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  alterHand: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },

  // Card-play moves: clicking a card in hand seeds `cardId`; subsequent
  // target picks land in the multi-valued `targets` array the move's
  // `execute` reads (rule 10-1-8 — targets pre-committed at play time).
  deployUnit: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: targetsMulti,
  },
  deployBase: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: targetsMulti,
  },
  playCommand: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: targetsMulti,
  },
  activateAbility: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: targetsMulti,
  },

  // Pair-pilot: the primary click is the pilot card; the subsequent
  // `selectTarget` step (`role: "unit"`) chooses the unit to attach.
  assignPilot: {
    seedPrimaryCard: (cardId) => ({ pilotId: cardId }),
    keyForSelectTarget: (step) => {
      if (step.role === "unit") return { key: "unitId", multi: false };
      return genericTargetKey(step);
    },
  },

  // Play Command card as Pilot (rule 3-4-6-2): primary click is the
  // command card itself; the subsequent `selectTarget` step (role
  // "unit") chooses the unit to pair with. The args shape uses
  // `cardId` (not `pilotId`) because the card's runtime type is
  // "command" — `executePilotPairing` is type-agnostic.
  playCommandAsPilot: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: (step) => {
      if (step.role === "unit") return { key: "unitId", multi: false };
      return genericTargetKey(step);
    },
  },

  // Combat: the primary click is the attacker; the next step asks for
  // the attack target (a unit or "player"-direct).
  enterBattle: {
    seedPrimaryCard: (cardId) => ({ attackerId: cardId }),
    keyForSelectTarget: (step) => {
      if (step.role === "attackTarget") return { key: "target", multi: false };
      return genericTargetKey(step);
    },
  },
  declareBlock: {
    seedPrimaryCard: (cardId) => ({ blockerId: cardId }),
    keyForSelectTarget: genericTargetKey,
  },

  // Hand-step cleanup: a multi-select from the hand with no separate
  // "primary" card; the first picked id seeds `cardIds` directly so
  // subsequent picks append into the same array.
  discardToHandLimit: {
    seedPrimaryCard: (cardId) => ({ cardIds: [cardId] }),
    keyForSelectTarget: (step) => {
      if (step.role === "discard-target") return { key: "cardIds", multi: true };
      return genericTargetKey(step);
    },
  },

  // Pass / concede / resolve: no primary card click. Bindings exist for
  // exhaustiveness; `seedPrimaryCard` returning `{ cardId }` is harmless
  // because the candidate enumerator gates on `requiresCardSelection`
  // before calling it, and the UI never invokes these for pass moves.
  passBlock: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  passBattleAction: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  passActionStep: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  passTurn: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  concede: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  skipOpponentTurn: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },
  dropOpponent: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: genericTargetKey,
  },

  // Pending-effect resolution: the click-driven path (e.g. picking a
  // legal target while a `targetSelection` prompt is open) writes into
  // the multi-valued `targets` array the move reads alongside
  // `optionalAnswers` and `pendingEffectId`.
  resolveEffect: {
    seedPrimaryCard: seedAsCardId,
    keyForSelectTarget: targetsMulti,
  },
};

/**
 * Convenience accessor — slightly nicer at call sites than indexing into
 * the record, and gives us a single place to thread future read-side
 * concerns (e.g. logging when a binding is consulted).
 */
export function getMoveBinding(name: GundamMoveName): MoveBinding {
  return MOVE_BINDINGS[name];
}

/**
 * Top-level helpers that mirror the legacy `seedForCard` / `keyForStep`
 * shapes from the simulator and the legacy `seedForPrimaryCard` /
 * `keyForSelectTarget` shapes from the candidate enumerator. Both
 * surfaces import these directly so any binding tweak shows up in both
 * paths simultaneously.
 */
export function seedPrimaryCardInput(
  moveName: GundamMoveName,
  cardId: string,
): Record<string, unknown> {
  return MOVE_BINDINGS[moveName].seedPrimaryCard(cardId);
}

export function selectTargetInputBinding(
  moveName: GundamMoveName,
  step: SelectTargetStep,
): SelectTargetBinding {
  return MOVE_BINDINGS[moveName].keyForSelectTarget(step);
}
