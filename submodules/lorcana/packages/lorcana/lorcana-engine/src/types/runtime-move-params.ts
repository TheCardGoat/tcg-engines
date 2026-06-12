/**
 * Lorcana Runtime Move Parameters
 *
 * Type-safe move parameters for the new MatchRuntime architecture.
 * Each move has explicit parameters that are passed via CommandEnvelope.
 */

import type {
  CardInstanceId,
  MoveDefinition,
  MoveInput,
  PlayerId,
  PlayerTargetDSL,
  ZoneId,
} from "#core";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { LorcanaTargetDSL } from "../targeting";
import type { Amount } from "@tcg/lorcana-types";

import type { LorcanaCardDerived } from "./projected-board";
import type { ActionResolutionInput } from "../runtime-moves/resolution/action-effects/types";
import type { DynamicAmountEventSnapshot } from "./domain-events";
import type { ActivateAbilityEffectSelectionsInput } from "../targeting/runtime/target-analysis";
import type { SlottedTargetInput } from "../targeting/slotted-targets";

/**
 * Play Card Cost Types - Discriminated Union
 *
 * `playerTargets` is intentionally included for forward compatibility with future runtime
 * support for player-targeted effects. The current runtime consumes player targets through
 * `targets` (mixed with card instance ids). When the runtime is updated to consume
 * `playerTargets` directly, clients can migrate to the new field without breaking changes.
 * See: https://github.com/TheCardGoat/the-card-goat-online/pull/228#discussion_r2894733960
 */
/**
 * Target input accepted by moves that prompt for selections.
 *
 * - **Flat array / scalar**: single-filter "pick N" effects (e.g. "deal 2 damage
 *   to chosen character", "remove damage from 3 chosen characters"). All picks
 *   share one filter and are interchangeable by position.
 * - **Slotted discriminated object**: effects with multiple distinct filter
 *   steps (e.g. move-damage's `from`/`to`, shift-and-choose's shift cost + pick).
 *   Each slot is addressable by key, so order can't be garbled by the UI.
 */
export type TargetInput =
  | CardInstanceId
  | PlayerId
  | readonly (CardInstanceId | PlayerId)[]
  | SlottedTargetInput;

export interface PlayCardActionResolutionInput {
  targets?: TargetInput;
  /** @internal Reserved for future runtime support. Currently consumed via `targets`. */
  playerTargets?: PlayerId | PlayerId[];
  amount?: Amount;
  namedCard?: string;
  resolveOptional?: boolean;
  enterPlayExerted?: boolean;
  choiceIndex?: number;
  preventAutoResolveTriggeredEffects?: boolean;
  destinations?: {
    zone: string;
    cards: CardInstanceId | CardInstanceId[];
  }[];
  eventSnapshot?: DynamicAmountEventSnapshot;
}

export type PlayCardCost =
  | { cost: "standard" }
  | {
      cost: "shift";
      shiftTarget: CardInstanceId;
      discardCards?: CardInstanceId[];
    }
  | { cost: "sing"; singer: CardInstanceId }
  | { cost: "singTogether"; singers: CardInstanceId[] }
  | { cost: "free" }
  | { cost: "sacrifice"; sacrificeTarget: CardInstanceId }
  | { cost: "exert-items"; exertTargets: CardInstanceId[] }
  | { cost: "put-on-deck-bottom"; deckBottomTarget: CardInstanceId };

/**
 * Lorcana Move Parameters
 *
 * Each property corresponds to a move in the runtime config.
 * Parameters are passed as `args` in the CommandEnvelope.
 */
export interface LorcanaRuntimeMoveParams {
  // ===== Setup Moves =====
  chooseWhoGoesFirst: { playerId: PlayerId };
  alterHand: { playerId: PlayerId; cardsToMulligan: CardInstanceId[] };

  // ===== Resource Moves =====
  putCardIntoInkwell: { cardId: CardInstanceId };

  // ===== Core Game Moves =====
  playCard: { cardId: CardInstanceId } & PlayCardCost & PlayCardActionResolutionInput;
  quest: { cardId: CardInstanceId };
  questWithAll: Record<string, never>;
  challenge: { attackerId: CardInstanceId; defenderId: CardInstanceId };

  // ===== Song Moves =====
  sing: { singerId: CardInstanceId; songId: CardInstanceId };
  singTogether: { singerIds: CardInstanceId[]; songId: CardInstanceId };

  // ===== Location Moves =====
  moveCharacterToLocation: {
    characterId: CardInstanceId;
    locationId: CardInstanceId;
  };

  // ===== Ability Moves =====
  activateAbility: {
    cardId: CardInstanceId;
    abilityIndex?: number;
    abilityText?: string;
    targets?: TargetInput;
    /**
     * Structured selections for effect resolution (not printed `costs.*`).
     * Merged into `targets` in canonical slot order; see `analyzeActivateAbilityEffectResolutionSlots`.
     */
    effectSelections?: ActivateAbilityEffectSelectionsInput;
    choiceIndex?: number;
    preventAutoResolveTriggeredEffects?: boolean;
    costs?: {
      banishCharacters?: CardInstanceId[];
      banishItems?: CardInstanceId[];
      exertCharacters?: CardInstanceId[];
      exertItems?: CardInstanceId[];
      discardCards?: CardInstanceId[];
    };
  };

  // ===== Effect Resolution =====
  resolveBag: { bagId: string; params?: Partial<ActionResolutionInput> };
  resolveEffect: { effectId: string; params: unknown };

  // ===== Standard Moves =====
  passTurn: Record<string, never>;
  concede: { playerId: PlayerId };

  // ===== Server-Only Moves =====
  forfeitGame: { winnerId: PlayerId; reason: string };

  // ===== Debug/Manual Moves =====
  manualMoveCard: {
    cardId: CardInstanceId;
    targetZoneId: ZoneId;
    position?: "top" | "bottom" | number;
  };
  manualExertCard: { cardId: CardInstanceId };
  manualReadyCard: { cardId: CardInstanceId };
  manualDryCard: { cardId: CardInstanceId };
  manualSetDamage: { cardId: CardInstanceId; damage: number };
  manualSetLore: { playerId: PlayerId; amount: number };
  manualShuffleDeck: { playerId: PlayerId };
  manualPassTurn: Record<string, never>;
}

export type LorcanaMoveTargetDSL = LorcanaTargetDSL | PlayerTargetDSL;

export type LorcanaRuntimeMoveInputs = {
  [K in keyof LorcanaRuntimeMoveParams]: MoveInput<LorcanaRuntimeMoveParams[K]>;
};

export type LorcanaMoveDefinition<T extends keyof LorcanaRuntimeMoveInputs> = MoveDefinition<
  LorcanaRuntimeMoveInputs[T],
  LorcanaMoveTargetDSL
>;
