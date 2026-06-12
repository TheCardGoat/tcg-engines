/**
 * Gundam TCG — Structured Game Log
 *
 * A typed, discriminated-union log schema for everything the replay/UI
 * layer needs to reconstruct a match. Separate from `events.ts` (which
 * drives reactive abilities) — logs describe *what happened*, events
 * drive *what triggers next*.
 *
 * Emission: call {@link emitGundamLog} from inside a move, lifecycle
 * handler, or effect handler. The helper adapts a `GundamGameLogEntry`
 * into the framework's generic `LogEntry` shape, storing the full typed
 * entry under `data` so consumers can narrow by `type`.
 *
 * Visibility: mirrors the Lorcana model —
 *   - PUBLIC                  → everyone sees the full entry
 *   - PRIVATE                 → only `visibleTo` players see it (e.g.,
 *                               look-at-top, mulligan contents)
 *   - PUBLIC_WITH_OVERRIDES   → everyone sees the entry; opponents see
 *                               redacted `values` per `overrides`
 *                               (e.g., tutor: searcher sees the cardId,
 *                               opponent sees "a card")
 *
 * Only PRIVATE narrows the stored `visibleTo`. PUBLIC and
 * PUBLIC_WITH_OVERRIDES both stay visible-to-all at the storage layer
 * — the UI reads `data.visibility.overrides` to apply per-viewer
 * redactions.
 */

import type { PlayerId as BrandedPlayerId } from "../types/branded.ts";
import type { FrameworkWriteAPI, LogEntry } from "../types/move-types.ts";
import { renderGundamLogTemplate } from "./i18n/render-log-template.ts";

// ── Visibility / Category ───────────────────────────────────────────────────

/**
 * Visibility narrows storage at emit time for PRIVATE entries. Gundam
 * moves pass around plain `string` player ids (the framework brands at
 * the boundary), so `visibleTo` uses the branded `PlayerId` type to
 * stay compatible with the storage-layer `LogEntry.visibleTo`.
 */
export type GundamLogVisibility =
  | { mode: "PUBLIC" }
  | { mode: "PRIVATE"; visibleTo: BrandedPlayerId[] }
  | {
      mode: "PUBLIC_WITH_OVERRIDES";
      /** Per-viewer (playerId) replacement values. Viewers not listed
       * fall back to the base `values`. Intended for reveals where the
       * acting player sees more than the opponent (tutors, scries). */
      overrides: Record<string, Record<string, unknown>>;
    };

export type GundamLogCategory = "action" | "rules" | "system";

// ── Payload types ───────────────────────────────────────────────────────────

// Payload field types. Gundam moves use plain `string` player ids
// throughout (the brand is applied at the framework boundary), so the
// log schema mirrors that — no casts needed at call sites.
type CardId = string;
type PlayerId = string;
type Zone = string;

// Setup
interface SetupFirstPlayerChosenValues {
  chooser: PlayerId;
  chosen: PlayerId;
}
interface SetupMulliganValues {
  playerId: PlayerId;
  /** Count of cards swapped. Actual cardIds belong under PRIVATE overrides. */
  count: number;
  cardIds?: CardId[];
}
type SetupDoneValues = Record<string, never>;

// Turn / phase
interface TurnStartedValues {
  playerId: PlayerId;
  turnNumber: number;
}
interface TurnEndedValues {
  playerId: PlayerId;
}
interface PhaseEnteredValues {
  phase: string;
  step?: string;
}

// Moves
interface DeployUnitValues {
  cardId: CardId;
  playerId: PlayerId;
  cost: number;
}
interface DeployBaseValues {
  cardId: CardId;
  playerId: PlayerId;
  cost: number;
}
interface PlayCommandValues {
  cardId: CardId;
  playerId: PlayerId;
  cost: number;
}
interface AssignPilotValues {
  pilotId: CardId;
  unitId: CardId;
  playerId: PlayerId;
}
interface ActivateAbilityValues {
  cardId: CardId;
  playerId: PlayerId;
  effectIndex: number;
}
interface AttackDeclaredValues {
  attackerId: CardId;
  /** Target unit instance ID, or `"direct"` for a direct attack on the
   * opposing player (matches {@link PendingCombatState.target}). */
  targetId: CardId;
  attackerPlayerId: PlayerId;
}
interface BlockDeclaredValues {
  blockerId: CardId;
  attackerId: CardId;
  blockerPlayerId: PlayerId;
}
interface MovePassValues {
  playerId: PlayerId;
  context: "action-step" | "block" | "battle" | "turn";
}
interface ConcedeValues {
  playerId: PlayerId;
}

// Cost payment
interface CostResourcesSpentValues {
  playerId: PlayerId;
  /** Regular resource cards exhausted. */
  regularCount: number;
  /** EX resource tokens removed from the game (rule 5-17-3-2-3). */
  exRemovedCount: number;
}
interface CostCardsDiscardedValues {
  playerId: PlayerId;
  cardIds: CardId[];
}
interface CostUnitsRestedValues {
  playerId: PlayerId;
  cardIds: CardId[];
}

// Combat outcomes
interface CombatDamageDealtValues {
  cardId: CardId;
  amount: number;
  /** Absent for damage from non-card sources (rare — effects normally
   * propagate a source). Optional to mirror the event payload shape. */
  sourceCardId?: CardId;
}
interface CombatShieldRemovedValues {
  cardId: CardId;
  playerId: PlayerId;
  /** Absent when a shield is removed by a non-card source. */
  sourceCardId?: CardId;
}
interface CombatUnitDefeatedValues {
  cardId: CardId;
  ownerId: PlayerId;
  defeatedBy?: CardId;
}
interface CombatResolvedValues {
  attackerId: CardId;
  /** Target unit instance ID, or `"direct"` for a direct attack. */
  targetId: CardId;
  blockerId?: CardId;
}

// Effect outcomes
interface EffectCardsDrawnValues {
  playerId: PlayerId;
  count: number;
  /** Drawn cardIds — private to the drawer; redacted for opponent. */
  cardIds?: CardId[];
}
interface EffectCardsDiscardedValues {
  playerId: PlayerId;
  cardIds: CardId[];
}
interface EffectReturnedToHandValues {
  cardId: CardId;
  playerId: PlayerId;
}
interface EffectMovedToZoneValues {
  cardId: CardId;
  from: Zone;
  to: Zone;
}
interface EffectExhaustedValues {
  cardId: CardId;
  reason?: string;
}
interface EffectReadiedValues {
  cardId: CardId;
  reason?: string;
}
interface EffectStatModifiedValues {
  cardId: CardId;
  stat: string;
  amount: number;
  duration: string;
}
interface EffectKeywordGrantedValues {
  cardId: CardId;
  keyword: string;
  duration: string;
}
interface EffectHpRecoveredValues {
  cardId: CardId;
  amount: number;
}
interface EffectDeckRevealedValues {
  playerId: PlayerId;
  cardIds: CardId[];
}
interface EffectCardTutoredValues {
  playerId: PlayerId;
  cardId: CardId;
}
interface EffectResourcePlacedValues {
  playerId: PlayerId;
  cardId: CardId;
  state: "active" | "rested";
}

// Pending-effects queue
interface PendingEnqueuedValues {
  effectId: string;
  sourceCardId: CardId;
  controllerId: PlayerId;
  kind: string;
  /** commandID of the originating move; undefined for engine-synthesised entries. */
  moveGroupId?: string;
}
interface PendingResolvedValues {
  effectId: string;
  sourceCardId: CardId;
  /** commandID of the originating move; undefined for engine-synthesised entries. */
  moveGroupId?: string;
}
/**
 * Not currently emitted — the engine has no cancel path that removes a
 * queued pending effect without running it. Variant kept for forward
 * compatibility (e.g., future "source left play invalidates queued
 * triggers" rule) so UI consumers can narrow on it once wired.
 */
interface PendingCancelledValues {
  effectId: string;
  sourceCardId: CardId;
  reason: string;
}

// System
interface SystemDeckOutValues {
  playerId: PlayerId;
}
interface SystemGameOverValues {
  winnerId?: PlayerId;
  reason: string;
}

// ── Error / Validation message payloads ─────────────────────────────────────
// Rule-validation messages that move validators render into
// MoveValidationResult.error. Kept inside GundamLogMessageMap so one
// translation catalog covers every user-facing string.

interface ErrorPlayInsufficientResourceLevelValues {
  required: number;
  have: number;
}
interface ErrorPlayInsufficientResourcesValues {
  required: number;
  have: number;
}
type ErrorBattleMustAttackRequiredTargetValues = Record<string, never>;
type ErrorBlockCannotBlockHighManeuverValues = Record<string, never>;
interface ErrorDiscardWrongCountValues {
  required: number;
  limit: number;
}
interface ErrorDiscardCardNotInHandValues {
  cardId: CardId;
}
type ErrorAbilityCardExhaustedValues = Record<string, never>;
interface ErrorAbilityWrongTargetCountValues {
  min: number;
  max: number;
  got: number;
}
interface ErrorAbilityIllegalTargetValues {
  cardId: CardId;
}
type ErrorPassBlockNotInBattlePhaseValues = Record<string, never>;
type ErrorPassBlockAttackerCannotPassValues = Record<string, never>;
interface ErrorSetupInvalidPlayerIdValues {
  playerId: PlayerId;
}
type ErrorReplayInvalidDataFormatValues = Record<string, never>;

// ── Key → values map (the discriminator) ────────────────────────────────────

export interface GundamLogMessageMap {
  "gundam.setup.firstPlayerChosen": SetupFirstPlayerChosenValues;
  "gundam.setup.mulligan": SetupMulliganValues;
  "gundam.setup.done": SetupDoneValues;

  "gundam.turn.started": TurnStartedValues;
  "gundam.turn.ended": TurnEndedValues;
  "gundam.phase.entered": PhaseEnteredValues;

  "gundam.move.deployUnit": DeployUnitValues;
  "gundam.move.deployBase": DeployBaseValues;
  "gundam.move.playCommand": PlayCommandValues;
  "gundam.move.assignPilot": AssignPilotValues;
  "gundam.move.activateAbility": ActivateAbilityValues;
  "gundam.move.attackDeclared": AttackDeclaredValues;
  "gundam.move.blockDeclared": BlockDeclaredValues;
  "gundam.move.pass": MovePassValues;
  "gundam.move.concede": ConcedeValues;

  "gundam.cost.resourcesSpent": CostResourcesSpentValues;
  "gundam.cost.cardsDiscarded": CostCardsDiscardedValues;
  "gundam.cost.unitsRested": CostUnitsRestedValues;

  "gundam.combat.damageDealt": CombatDamageDealtValues;
  "gundam.combat.shieldRemoved": CombatShieldRemovedValues;
  "gundam.combat.unitDefeated": CombatUnitDefeatedValues;
  "gundam.combat.resolved": CombatResolvedValues;

  "gundam.effect.cardsDrawn": EffectCardsDrawnValues;
  "gundam.effect.cardsDiscarded": EffectCardsDiscardedValues;
  "gundam.effect.returnedToHand": EffectReturnedToHandValues;
  "gundam.effect.movedToZone": EffectMovedToZoneValues;
  "gundam.effect.exhausted": EffectExhaustedValues;
  "gundam.effect.readied": EffectReadiedValues;
  "gundam.effect.statModified": EffectStatModifiedValues;
  "gundam.effect.keywordGranted": EffectKeywordGrantedValues;
  "gundam.effect.hpRecovered": EffectHpRecoveredValues;
  "gundam.effect.deckRevealed": EffectDeckRevealedValues;
  "gundam.effect.cardTutored": EffectCardTutoredValues;
  "gundam.effect.resourcePlaced": EffectResourcePlacedValues;

  "gundam.pending.enqueued": PendingEnqueuedValues;
  "gundam.pending.resolved": PendingResolvedValues;
  "gundam.pending.cancelled": PendingCancelledValues;

  "gundam.system.deckOut": SystemDeckOutValues;
  "gundam.system.gameOver": SystemGameOverValues;

  "gundam.error.play.insufficientResourceLevel": ErrorPlayInsufficientResourceLevelValues;
  "gundam.error.play.insufficientResources": ErrorPlayInsufficientResourcesValues;
  "gundam.error.battle.mustAttackRequiredTarget": ErrorBattleMustAttackRequiredTargetValues;
  "gundam.error.block.cannotBlockHighManeuver": ErrorBlockCannotBlockHighManeuverValues;
  "gundam.error.discard.wrongCount": ErrorDiscardWrongCountValues;
  "gundam.error.discard.cardNotInHand": ErrorDiscardCardNotInHandValues;
  "gundam.error.ability.cardExhausted": ErrorAbilityCardExhaustedValues;
  "gundam.error.ability.wrongTargetCount": ErrorAbilityWrongTargetCountValues;
  "gundam.error.ability.illegalTarget": ErrorAbilityIllegalTargetValues;
  "gundam.error.passBlock.notInBattlePhase": ErrorPassBlockNotInBattlePhaseValues;
  "gundam.error.passBlock.attackerCannotPass": ErrorPassBlockAttackerCannotPassValues;
  "gundam.error.setup.invalidPlayerId": ErrorSetupInvalidPlayerIdValues;
  "gundam.error.replay.invalidDataFormat": ErrorReplayInvalidDataFormatValues;
}

export type GundamLogMessageKey = keyof GundamLogMessageMap;

export type GundamActionLogMessageKey =
  | "gundam.move.deployUnit"
  | "gundam.move.deployBase"
  | "gundam.move.playCommand"
  | "gundam.move.assignPilot"
  | "gundam.move.attackDeclared"
  | "gundam.move.blockDeclared"
  | "gundam.move.activateAbility"
  | "gundam.move.pass"
  | "gundam.move.concede"
  | "gundam.turn.started"
  | "gundam.system.gameOver";

// Re-export i18n key mappings from the cycle-free module. The maps live
// in i18n/translation-keys.ts to avoid the runtime circular dependency:
// logging.ts → render-log-template.ts → log-translation-contract.ts → logging.ts
export {
  GUNDAM_LOG_TRANSLATION_KEYS,
  GUNDAM_LOG_TRANSLATION_VALUE_KEYS,
} from "./i18n/translation-keys.ts";

export type GundamGameLogEntry = {
  [K in GundamLogMessageKey]: {
    type: K;
    values: GundamLogMessageMap[K];
    visibility: GundamLogVisibility;
    category: GundamLogCategory;
  };
}[GundamLogMessageKey];

// ── Emission helper ─────────────────────────────────────────────────────────

/**
 * Emit a typed Gundam log entry via the framework's generic log sink.
 * The full typed entry is preserved under `data` so consumers can
 * narrow by `entry.data.type`. Storage-layer `visibleTo` is derived
 * from `entry.visibility.mode`.
 */
export function emitGundamLog(framework: FrameworkWriteAPI, entry: GundamGameLogEntry): void {
  const visibleTo = entry.visibility.mode === "PRIVATE" ? entry.visibility.visibleTo : undefined;
  // PUBLIC_WITH_OVERRIDES: leave message empty so the UI renders per-viewer
  // using data.visibility.overrides. Pre-rendering from unredacted values
  // would leak hidden information to opponents.
  const message =
    entry.visibility.mode === "PUBLIC_WITH_OVERRIDES"
      ? ""
      : renderGundamLogTemplate(entry.type, entry.values);

  const logEntry: LogEntry = {
    type: entry.type,
    message,
    data: entry as unknown as Record<string, unknown>,
    visibleTo,
  };

  framework.log(logEntry);
}

/**
 * Typed-key constructor for {@link GundamGameLogEntry}. Useful when
 * building an entry inline at a call site — TypeScript infers `values`
 * from the key so the payload is checked statically.
 */
export function typedGundamLog<K extends GundamLogMessageKey>(args: {
  type: K;
  values: GundamLogMessageMap[K];
  visibility: GundamLogVisibility;
  category: GundamLogCategory;
}): GundamGameLogEntry {
  return args as GundamGameLogEntry;
}

// ── Lifecycle helpers (wave 5) ──────────────────────────────────────────────
// Phase/step transitions are system entries — bookkeeping events that
// narrate the turn structure, not player actions.

export function logPhaseEntered(
  framework: FrameworkWriteAPI,
  values: GundamLogMessageMap["gundam.phase.entered"],
): void {
  emitGundamLog(framework, {
    type: "gundam.phase.entered",
    values,
    visibility: { mode: "PUBLIC" },
    category: "system",
  });
}

// ── Combat helpers (wave 4) ─────────────────────────────────────────────────
// All combat outcomes are public action entries — shields and damage
// are observable to both players by rule. Grouped as helpers because
// combat resolution emits ~20 log sites across resolve-direct,
// resolve-blocked, and the damage handler; inlining the full entry at
// each would be noise.

export function logCombatDamage(
  framework: FrameworkWriteAPI,
  values: GundamLogMessageMap["gundam.combat.damageDealt"],
): void {
  emitGundamLog(framework, {
    type: "gundam.combat.damageDealt",
    values,
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}

export function logUnitDefeated(
  framework: FrameworkWriteAPI,
  values: GundamLogMessageMap["gundam.combat.unitDefeated"],
): void {
  emitGundamLog(framework, {
    type: "gundam.combat.unitDefeated",
    values,
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}

export function logShieldRemoved(
  framework: FrameworkWriteAPI,
  values: GundamLogMessageMap["gundam.combat.shieldRemoved"],
): void {
  emitGundamLog(framework, {
    type: "gundam.combat.shieldRemoved",
    values,
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}

export function logCombatResolved(
  framework: FrameworkWriteAPI,
  values: GundamLogMessageMap["gundam.combat.resolved"],
): void {
  emitGundamLog(framework, {
    type: "gundam.combat.resolved",
    values,
    visibility: { mode: "PUBLIC" },
    category: "action",
  });
}
