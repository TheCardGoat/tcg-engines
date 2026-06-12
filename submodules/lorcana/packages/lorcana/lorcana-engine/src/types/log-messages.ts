/**
 * Lorcana Log Message Contracts
 *
 * Central registry of log keys, payload typing, and translation keys.
 * Add new log keys here first so type-checking enforces translation coverage.
 */

import type { CardInstanceId, LogMessage, LogValue, LogVisibility, PlayerId } from "#core";

export interface FirstPlayerChosenLogValues {
  chooser: PlayerId;
  chosen: PlayerId;
}

export interface SetupMulliganCountLogValues {
  playerId: PlayerId;
  count: number;
}

export interface SetupMulliganDetailLogValues {
  playerId: PlayerId;
  count: number;
  mulliganed: CardInstanceId[];
  drawn: CardInstanceId[];
}

export interface SetupDoneLogValues {}

export interface AbilityActivatedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface NamedAbilityActivatedLogValues extends AbilityActivatedLogValues {
  abilityName: string;
}

/** Named ability activation when a discard cost was paid (choose-and-discard costs). */
export interface NamedAbilityActivatedWithDiscardCostLogValues extends NamedAbilityActivatedLogValues {
  discardCardIds: CardInstanceId[];
}

/** Unnamed ability activation when a discard cost was paid. */
export interface AbilityActivatedWithDiscardCostLogValues extends AbilityActivatedLogValues {
  discardCardIds: CardInstanceId[];
}

export interface CardInkedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface ScryCountLogValues {
  playerId: PlayerId;
  count: number;
}

export interface ScryDetailLogValues {
  playerId: PlayerId;
  count: number;
  lookedAt: CardInstanceId[];
}

export interface LookAtInkwellLogValues {
  playerId: PlayerId;
  count: number;
}

export interface LookAtInkwellDetailLogValues {
  playerId: PlayerId;
  count: number;
  cardIds: CardInstanceId[];
}

export interface PlayCardLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface QuestLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
  loreGained: number;
}

export interface QuestWithAllLogValues {
  playerId: PlayerId;
  cardIds: CardInstanceId[];
  loreGained: number;
  count: number;
}

export interface ChallengeLogValues {
  playerId: PlayerId;
  attackerId: CardInstanceId;
  defenderId: CardInstanceId;
}

export interface MoveCharacterToLocationLogValues {
  playerId: PlayerId;
  characterId: CardInstanceId;
  locationId: CardInstanceId;
}

export interface PassTurnLogValues {
  playerId: PlayerId;
}

export interface ConcedeLogValues {
  playerId: PlayerId;
}

export interface ForfeitGameLogValues {
  winnerId: PlayerId;
  reason: string;
}

export interface SystemTurnSkippedLogValues {
  skipperPlayerId: PlayerId;
  stallerPlayerId: PlayerId;
}

export interface SystemPlayerDroppedLogValues {
  dropperPlayerId: PlayerId;
  droppedPlayerId: PlayerId;
  reason: string;
}

export type LogTargetId = CardInstanceId | PlayerId;

export interface ResolveBagCompletedLogValues {
  playerId: PlayerId;
  sourceId: CardInstanceId;
}

export interface ResolveBagCompletedNamedLogValues extends ResolveBagCompletedLogValues {
  abilityName: string;
}

export interface ResolveBagCompletedTargetsLogValues extends ResolveBagCompletedLogValues {
  targets: LogTargetId[];
}

export interface ResolveBagCompletedTargetsNamedLogValues extends ResolveBagCompletedTargetsLogValues {
  abilityName: string;
}

export interface ResolveBagSkippedLogValues extends ResolveBagCompletedLogValues {}

export interface ResolveBagSkippedNamedLogValues extends ResolveBagCompletedNamedLogValues {}

export interface ResolveBagPendingLogValues extends ResolveBagCompletedLogValues {}

export interface ResolveBagPendingNamedLogValues extends ResolveBagCompletedNamedLogValues {}

export interface ResolveBagPendingNamedTargetsLogValues extends ResolveBagPendingNamedLogValues {
  targets: LogTargetId[];
}

export type ResolveBagCancelledCause = "no-valid-targets" | "condition-not-met" | "restriction";

export interface ResolveBagCancelledLogValues extends ResolveBagCompletedLogValues {
  cause: ResolveBagCancelledCause;
}

export interface ResolveBagCancelledNamedLogValues extends ResolveBagCompletedNamedLogValues {
  cause: ResolveBagCancelledCause;
}

export interface EffectCancelledLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  cause: ResolveBagCancelledCause;
}

export interface ResolveDiscardChoiceLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  targets: LogTargetId[];
}

export interface ResolveTargetSelectionLogValues extends ResolveDiscardChoiceLogValues {
  effectType?: string;
}

export interface ResolveChoiceSelectionLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  choiceIndex: number;
  choiceLabel?: string;
}

export interface ResolveOptionalSelectionLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
}

export interface ResolveOptionalSelectionTargetsLogValues extends ResolveOptionalSelectionLogValues {
  targets: LogTargetId[];
}

export interface ResolveOptionalSelectionTargetsNamedLogValues extends ResolveOptionalSelectionTargetsLogValues {
  abilityName: string;
}

export interface ResolveNameCardSelectionLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  namedCard: string;
}

export interface ResolveScrySelectionLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
}

export interface ScryDestinationEntry {
  zone: string;
  cardIds: CardInstanceId[];
  /** When true, the cards in this destination were revealed publicly to all players. */
  revealed?: boolean;
}

export interface ResolveScrySelectionDetailLogValues extends ResolveScrySelectionLogValues {
  selection: string[];
  destinations?: ScryDestinationEntry[];
  deckTopCards?: CardInstanceId[];
  deckBottomCards?: CardInstanceId[];
  handCards?: CardInstanceId[];
  playCards?: CardInstanceId[];
  inkwellCards?: CardInstanceId[];
  discardCards?: CardInstanceId[];
}

export interface RevealTopCardLogValues {
  playerId: PlayerId;
  targetPlayerId: PlayerId;
  revealedCardId: CardInstanceId;
}

export interface RevealTopCardAutoBottomLogValues {
  playerId: PlayerId;
  targetPlayerId: PlayerId;
  revealedCardId: CardInstanceId;
}

export interface ResolveChoiceWithRevealLogValues {
  playerId: PlayerId;
  sourceCardId: CardInstanceId;
  revealedCardId: CardInstanceId;
  choiceIndex: number;
  choiceLabel?: string;
}

// =============================================================================
// Outcome Log Values — projected from domain events via LogProjector
// =============================================================================

export interface CombatDamageLogValues {
  playerId: PlayerId;
  attackerId: CardInstanceId;
  defenderId: CardInstanceId;
  attackerDamage: number;
  defenderDamage: number;
}

export interface EffectDamageLogValues {
  playerId: PlayerId;
  sourceId: CardInstanceId;
  targetId: CardInstanceId;
  amount: number;
}

export interface MovedDamageLogValues {
  playerId: PlayerId;
  sourceId: CardInstanceId;
  targetId: CardInstanceId;
  amount: number;
}

export interface PreventedDamageLogValues {
  playerId: PlayerId;
  targetId: CardInstanceId;
  amount: number;
}

export interface CardBanishedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface CardsDrawnLogValues {
  playerId: PlayerId;
  amount: number;
}

export interface CardsDrawnDetailLogValues {
  playerId: PlayerId;
  amount: number;
  cardIds: CardInstanceId[];
}

export interface CardsDiscardedDetailLogValues {
  playerId: PlayerId;
  amount: number;
  cardIds: CardInstanceId[];
}

export interface PrivateCardsDrawnDetailLogValues {
  playerId: PlayerId;
  cardIds: CardInstanceId[];
}

export interface PrivateMulliganDetailLogValues {
  playerId: PlayerId;
  mulliganed: CardInstanceId[];
  drawn: CardInstanceId[];
}

export interface PrivateLookAtInkwellDetailLogValues {
  playerId: PlayerId;
  cardIds: CardInstanceId[];
}

export interface PrivateScrySelectionDetailLogValues extends ResolveScrySelectionLogValues {
  selection: string[];
  destinations?: ScryDestinationEntry[];
  deckTopCards?: CardInstanceId[];
}

export interface CardReturnedToHandLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface LoreGainedLogValues {
  playerId: PlayerId;
  amount: number;
}

export interface LocationLoreGainedLogValues {
  playerId: PlayerId;
  amount: number;
  locationCount: number;
}

export interface LoreLostLogValues {
  playerId: PlayerId;
  amount: number;
}

export interface OutcomeCardExertedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface OutcomeCardReadiedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface CardsMilledLogValues {
  playerId: PlayerId;
  amount: number;
}

export interface CardsPutOnBottomLogValues {
  playerId: PlayerId;
  cardIds: CardInstanceId[];
}

export interface PlayCardShiftLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
  shiftTargetId: CardInstanceId;
}

export interface OutcomeCardInkedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface OutcomeCardInkedExertedLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
}

export interface PlayCardSingLogValues {
  playerId: PlayerId;
  cardId: CardInstanceId;
  singerIds: CardInstanceId[];
}

export interface LorcanaLogMessageMap {
  "lorcana.setup.firstPlayerChosen": FirstPlayerChosenLogValues;
  "lorcana.setup.mulligan.count": SetupMulliganCountLogValues;
  "lorcana.setup.mulligan.detail": SetupMulliganDetailLogValues;
  "lorcana.setup.done": SetupDoneLogValues;
  "lorcana.ability.activated": AbilityActivatedLogValues;
  "lorcana.ability.activated.named": NamedAbilityActivatedLogValues;
  "lorcana.ability.activated.named.discardCost": NamedAbilityActivatedWithDiscardCostLogValues;
  "lorcana.ability.activated.discardCost": AbilityActivatedWithDiscardCostLogValues;
  "lorcana.card.inked": CardInkedLogValues;
  "lorcana.scry.count": ScryCountLogValues;
  "lorcana.scry.detail": ScryDetailLogValues;
  "lorcana.effect.lookAtInkwell": LookAtInkwellLogValues;
  "lorcana.effect.lookAtInkwell.detail": LookAtInkwellDetailLogValues;
  "lorcana.move.playCard": PlayCardLogValues;
  "lorcana.move.quest": QuestLogValues;
  "lorcana.move.questWithAll": QuestWithAllLogValues;
  "lorcana.move.challenge": ChallengeLogValues;
  "lorcana.move.moveCharacterToLocation": MoveCharacterToLocationLogValues;
  "lorcana.move.passTurn": PassTurnLogValues;
  "lorcana.move.concede": ConcedeLogValues;
  "lorcana.move.forfeitGame": ForfeitGameLogValues;
  "lorcana.system.turnSkipped": SystemTurnSkippedLogValues;
  "lorcana.system.playerDropped": SystemPlayerDroppedLogValues;
  "lorcana.bag.resolve.completed": ResolveBagCompletedLogValues;
  "lorcana.bag.resolve.completed.named": ResolveBagCompletedNamedLogValues;
  "lorcana.bag.resolve.completed.targets": ResolveBagCompletedTargetsLogValues;
  "lorcana.bag.resolve.completed.targets.named": ResolveBagCompletedTargetsNamedLogValues;
  "lorcana.bag.resolve.skipped": ResolveBagSkippedLogValues;
  "lorcana.bag.resolve.skipped.named": ResolveBagSkippedNamedLogValues;
  "lorcana.bag.resolve.pending": ResolveBagPendingLogValues;
  "lorcana.bag.resolve.pending.named": ResolveBagPendingNamedLogValues;
  "lorcana.bag.resolve.pending.named.targets": ResolveBagPendingNamedTargetsLogValues;
  "lorcana.bag.resolve.cancelled": ResolveBagCancelledLogValues;
  "lorcana.bag.resolve.cancelled.named": ResolveBagCancelledNamedLogValues;
  "lorcana.effect.cancelled": EffectCancelledLogValues;
  "lorcana.effect.resolve.discardChoice": ResolveDiscardChoiceLogValues;
  "lorcana.effect.resolve.targetSelection": ResolveTargetSelectionLogValues;
  "lorcana.effect.resolve.choiceSelection": ResolveChoiceSelectionLogValues;
  "lorcana.effect.resolve.optionalSelection.accepted": ResolveOptionalSelectionLogValues;
  "lorcana.effect.resolve.optionalSelection.accepted.targets": ResolveOptionalSelectionTargetsLogValues;
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named": ResolveOptionalSelectionTargetsNamedLogValues;
  "lorcana.effect.resolve.optionalSelection.rejected": ResolveOptionalSelectionLogValues;
  "lorcana.effect.resolve.nameCardSelection": ResolveNameCardSelectionLogValues;
  "lorcana.effect.resolve.scrySelection": ResolveScrySelectionLogValues;
  "lorcana.effect.resolve.scrySelection.detail": ResolveScrySelectionDetailLogValues;
  "lorcana.effect.resolve.revealTopCard": RevealTopCardLogValues;
  "lorcana.effect.resolve.revealTopCard.autoBottom": RevealTopCardAutoBottomLogValues;
  "lorcana.effect.resolve.choiceSelection.withReveal": ResolveChoiceWithRevealLogValues;
  "lorcana.outcome.combatDamage": CombatDamageLogValues;
  "lorcana.outcome.effectDamage": EffectDamageLogValues;
  "lorcana.outcome.damageMoved": MovedDamageLogValues;
  "lorcana.outcome.damagePrevented": PreventedDamageLogValues;
  "lorcana.outcome.cardBanished": CardBanishedLogValues;
  "lorcana.outcome.cardsDrawn": CardsDrawnLogValues;
  "lorcana.outcome.cardsDrawn.detail": CardsDrawnDetailLogValues;
  "lorcana.outcome.cardsDiscarded.detail": CardsDiscardedDetailLogValues;
  "lorcana.outcome.cardReturnedToHand": CardReturnedToHandLogValues;
  "lorcana.outcome.loreGained": LoreGainedLogValues;
  "lorcana.outcome.locationLoreGained": LocationLoreGainedLogValues;
  "lorcana.outcome.loreLost": LoreLostLogValues;
  "lorcana.outcome.cardExerted": OutcomeCardExertedLogValues;
  "lorcana.outcome.cardReadied": OutcomeCardReadiedLogValues;
  "lorcana.outcome.cardsMilled": CardsMilledLogValues;
  "lorcana.outcome.cardsPutOnBottom": CardsPutOnBottomLogValues;
  "lorcana.move.playCard.shift": PlayCardShiftLogValues;
  "lorcana.move.playCard.sing": PlayCardSingLogValues;
  "lorcana.outcome.cardInked": OutcomeCardInkedLogValues;
  "lorcana.outcome.cardInkedExerted": OutcomeCardInkedExertedLogValues;
  "lorcana.private.cardsDrawn.detail": PrivateCardsDrawnDetailLogValues;
  "lorcana.private.setup.mulligan.detail": PrivateMulliganDetailLogValues;
  "lorcana.private.effect.lookAtInkwell.detail": PrivateLookAtInkwellDetailLogValues;
  "lorcana.private.effect.resolve.scrySelection.detail": PrivateScrySelectionDetailLogValues;
}

export type LorcanaLogMessageKey = keyof LorcanaLogMessageMap & string;

/**
 * Subset of LorcanaLogMessageKey for entries that correspond to a direct player or system action
 * and MUST produce a MoveLog. Every member is handled in move-log-factory.ts's
 * convertProjectedEntry — TypeScript enforces exhaustiveness via the assertNever default there.
 *
 * Keys absent from this type are derived outcomes or private detail variants that are never the
 * primary action entry (e.g. lorcana.outcome.*, lorcana.setup.done, *.detail overrides).
 */
export type ActionLogMessageKey =
  | "lorcana.setup.firstPlayerChosen"
  | "lorcana.setup.mulligan.count"
  | "lorcana.ability.activated"
  | "lorcana.ability.activated.named"
  | "lorcana.ability.activated.named.discardCost"
  | "lorcana.ability.activated.discardCost"
  | "lorcana.card.inked"
  | "lorcana.effect.lookAtInkwell"
  | "lorcana.effect.lookAtInkwell.detail"
  | "lorcana.move.playCard"
  | "lorcana.move.playCard.shift"
  | "lorcana.move.playCard.sing"
  | "lorcana.move.quest"
  | "lorcana.move.questWithAll"
  | "lorcana.move.challenge"
  | "lorcana.move.moveCharacterToLocation"
  | "lorcana.move.passTurn"
  | "lorcana.move.concede"
  | "lorcana.move.forfeitGame"
  | "lorcana.system.turnSkipped"
  | "lorcana.system.playerDropped"
  | "lorcana.bag.resolve.completed"
  | "lorcana.bag.resolve.completed.named"
  | "lorcana.bag.resolve.completed.targets"
  | "lorcana.bag.resolve.completed.targets.named"
  | "lorcana.bag.resolve.skipped"
  | "lorcana.bag.resolve.skipped.named"
  | "lorcana.bag.resolve.pending"
  | "lorcana.bag.resolve.pending.named"
  | "lorcana.bag.resolve.pending.named.targets"
  | "lorcana.bag.resolve.cancelled"
  | "lorcana.bag.resolve.cancelled.named"
  | "lorcana.effect.cancelled"
  | "lorcana.effect.resolve.discardChoice"
  | "lorcana.effect.resolve.targetSelection"
  | "lorcana.effect.resolve.choiceSelection"
  | "lorcana.effect.resolve.choiceSelection.withReveal"
  | "lorcana.effect.resolve.optionalSelection.accepted"
  | "lorcana.effect.resolve.optionalSelection.accepted.targets"
  | "lorcana.effect.resolve.optionalSelection.accepted.targets.named"
  | "lorcana.effect.resolve.optionalSelection.rejected"
  | "lorcana.effect.resolve.nameCardSelection"
  | "lorcana.effect.resolve.scrySelection"
  | "lorcana.effect.resolve.scrySelection.detail"
  | "lorcana.effect.resolve.revealTopCard"
  | "lorcana.effect.resolve.revealTopCard.autoBottom";

// Compile-time assertion: every ActionLogMessageKey must be a valid LorcanaLogMessageKey.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _ActionLogMessageKeySubsetCheck = ActionLogMessageKey extends LorcanaLogMessageKey
  ? true
  : never;

export type LorcanaLogMessage<TKey extends LorcanaLogMessageKey = LorcanaLogMessageKey> =
  TKey extends LorcanaLogMessageKey
    ? {
        key: TKey;
        values: LorcanaLogMessageMap[TKey];
      }
    : never;

export type LorcanaParaglideMessageKey = `lorcana.${string}`;

export const LORCANA_LOG_TRANSLATION_KEYS = {
  "lorcana.setup.firstPlayerChosen": "lorcana.setup.firstPlayerChosen",
  "lorcana.setup.mulligan.count": "lorcana.setup.mulligan.count",
  "lorcana.setup.mulligan.detail": "lorcana.setup.mulligan.detail",
  "lorcana.setup.done": "lorcana.setup.done",
  "lorcana.ability.activated": "lorcana.ability.activated",
  "lorcana.ability.activated.named": "lorcana.ability.activated.named",
  "lorcana.ability.activated.named.discardCost": "lorcana.ability.activated.named.discardCost",
  "lorcana.ability.activated.discardCost": "lorcana.ability.activated.discardCost",
  "lorcana.card.inked": "lorcana.card.inked",
  "lorcana.scry.count": "lorcana.scry.count",
  "lorcana.scry.detail": "lorcana.scry.detail",
  "lorcana.effect.lookAtInkwell": "lorcana.effect.lookAtInkwell",
  "lorcana.effect.lookAtInkwell.detail": "lorcana.effect.lookAtInkwell.detail",
  "lorcana.move.playCard": "lorcana.move.playCard",
  "lorcana.move.quest": "lorcana.move.quest",
  "lorcana.move.questWithAll": "lorcana.move.questWithAll",
  "lorcana.move.challenge": "lorcana.move.challenge",
  "lorcana.move.moveCharacterToLocation": "lorcana.move.moveCharacterToLocation",
  "lorcana.move.passTurn": "lorcana.move.passTurn",
  "lorcana.move.concede": "lorcana.move.concede",
  "lorcana.move.forfeitGame": "lorcana.move.forfeitGame",
  "lorcana.system.turnSkipped": "lorcana.system.turnSkipped",
  "lorcana.system.playerDropped": "lorcana.system.playerDropped",
  "lorcana.bag.resolve.completed": "lorcana.bag.resolve.completed",
  "lorcana.bag.resolve.completed.named": "lorcana.bag.resolve.completed.named",
  "lorcana.bag.resolve.completed.targets": "lorcana.bag.resolve.completed.targets",
  "lorcana.bag.resolve.completed.targets.named": "lorcana.bag.resolve.completed.targets.named",
  "lorcana.bag.resolve.skipped": "lorcana.bag.resolve.skipped",
  "lorcana.bag.resolve.skipped.named": "lorcana.bag.resolve.skipped.named",
  "lorcana.bag.resolve.pending": "lorcana.bag.resolve.pending",
  "lorcana.bag.resolve.pending.named": "lorcana.bag.resolve.pending.named",
  "lorcana.bag.resolve.pending.named.targets": "lorcana.bag.resolve.pending.named.targets",
  "lorcana.bag.resolve.cancelled": "lorcana.bag.resolve.cancelled",
  "lorcana.bag.resolve.cancelled.named": "lorcana.bag.resolve.cancelled.named",
  "lorcana.effect.cancelled": "lorcana.effect.cancelled",
  "lorcana.effect.resolve.discardChoice": "lorcana.effect.resolve.discardChoice",
  "lorcana.effect.resolve.targetSelection": "lorcana.effect.resolve.targetSelection",
  "lorcana.effect.resolve.choiceSelection": "lorcana.effect.resolve.choiceSelection",
  "lorcana.effect.resolve.optionalSelection.accepted":
    "lorcana.effect.resolve.optionalSelection.accepted",
  "lorcana.effect.resolve.optionalSelection.accepted.targets":
    "lorcana.effect.resolve.optionalSelection.accepted.targets",
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named":
    "lorcana.effect.resolve.optionalSelection.accepted.targets.named",
  "lorcana.effect.resolve.optionalSelection.rejected":
    "lorcana.effect.resolve.optionalSelection.rejected",
  "lorcana.effect.resolve.nameCardSelection": "lorcana.effect.resolve.nameCardSelection",
  "lorcana.effect.resolve.scrySelection": "lorcana.effect.resolve.scrySelection",
  "lorcana.effect.resolve.scrySelection.detail": "lorcana.effect.resolve.scrySelection.detail",
  "lorcana.effect.resolve.revealTopCard": "lorcana.effect.resolve.revealTopCard",
  "lorcana.effect.resolve.revealTopCard.autoBottom":
    "lorcana.effect.resolve.revealTopCard.autoBottom",
  "lorcana.effect.resolve.choiceSelection.withReveal":
    "lorcana.effect.resolve.choiceSelection.withReveal",
  "lorcana.outcome.combatDamage": "lorcana.outcome.combatDamage",
  "lorcana.outcome.effectDamage": "lorcana.outcome.effectDamage",
  "lorcana.outcome.damageMoved": "lorcana.outcome.damageMoved",
  "lorcana.outcome.damagePrevented": "lorcana.outcome.damagePrevented",
  "lorcana.outcome.cardBanished": "lorcana.outcome.cardBanished",
  "lorcana.outcome.cardsDrawn": "lorcana.outcome.cardsDrawn",
  "lorcana.outcome.cardsDrawn.detail": "lorcana.outcome.cardsDrawn.detail",
  "lorcana.outcome.cardsDiscarded.detail": "lorcana.outcome.cardsDiscarded.detail",
  "lorcana.outcome.cardReturnedToHand": "lorcana.outcome.cardReturnedToHand",
  "lorcana.outcome.loreGained": "lorcana.outcome.loreGained",
  "lorcana.outcome.locationLoreGained": "lorcana.outcome.locationLoreGained",
  "lorcana.outcome.loreLost": "lorcana.outcome.loreLost",
  "lorcana.outcome.cardExerted": "lorcana.outcome.cardExerted",
  "lorcana.outcome.cardReadied": "lorcana.outcome.cardReadied",
  "lorcana.outcome.cardsMilled": "lorcana.outcome.cardsMilled",
  "lorcana.outcome.cardsPutOnBottom": "lorcana.outcome.cardsPutOnBottom",
  "lorcana.move.playCard.shift": "lorcana.move.playCard.shift",
  "lorcana.move.playCard.sing": "lorcana.move.playCard.sing",
  "lorcana.outcome.cardInked": "lorcana.outcome.cardInked",
  "lorcana.outcome.cardInkedExerted": "lorcana.outcome.cardInkedExerted",
  "lorcana.private.cardsDrawn.detail": "lorcana.private.cardsDrawn.detail",
  "lorcana.private.setup.mulligan.detail": "lorcana.private.setup.mulligan.detail",
  "lorcana.private.effect.lookAtInkwell.detail": "lorcana.private.effect.lookAtInkwell.detail",
  "lorcana.private.effect.resolve.scrySelection.detail":
    "lorcana.private.effect.resolve.scrySelection.detail",
} as const satisfies Record<LorcanaLogMessageKey, LorcanaParaglideMessageKey>;

export const LORCANA_LOG_TRANSLATION_VALUE_KEYS = {
  "lorcana.setup.firstPlayerChosen": ["chosen"],
  "lorcana.setup.mulligan.count": ["count"],
  "lorcana.setup.mulligan.detail": ["count", "mulliganed", "drawn"],
  "lorcana.setup.done": [],
  "lorcana.ability.activated": ["cardId"],
  "lorcana.ability.activated.named": ["cardId", "abilityName"],
  "lorcana.ability.activated.named.discardCost": ["cardId", "abilityName", "discardCardIds"],
  "lorcana.ability.activated.discardCost": ["cardId", "discardCardIds"],
  "lorcana.card.inked": ["cardId"],
  "lorcana.scry.count": ["count"],
  "lorcana.scry.detail": ["count", "lookedAt"],
  "lorcana.effect.lookAtInkwell": ["count"],
  "lorcana.effect.lookAtInkwell.detail": ["count", "cardIds"],
  "lorcana.move.playCard": ["cardId"],
  "lorcana.move.quest": ["cardId", "loreGained"],
  "lorcana.move.questWithAll": ["count", "cardIds", "loreGained"],
  "lorcana.move.challenge": ["attackerId", "defenderId"],
  "lorcana.move.moveCharacterToLocation": ["characterId", "locationId"],
  "lorcana.move.passTurn": [],
  "lorcana.move.concede": [],
  "lorcana.move.forfeitGame": ["winnerId"],
  "lorcana.system.turnSkipped": ["skipperPlayerId", "stallerPlayerId"],
  "lorcana.system.playerDropped": ["dropperPlayerId", "droppedPlayerId", "reason"],
  "lorcana.bag.resolve.completed": ["sourceId"],
  "lorcana.bag.resolve.completed.named": ["sourceId", "abilityName"],
  "lorcana.bag.resolve.completed.targets": ["sourceId", "targets"],
  "lorcana.bag.resolve.completed.targets.named": ["sourceId", "abilityName", "targets"],
  "lorcana.bag.resolve.skipped": ["sourceId"],
  "lorcana.bag.resolve.skipped.named": ["sourceId", "abilityName"],
  "lorcana.bag.resolve.pending": ["sourceId"],
  "lorcana.bag.resolve.pending.named": ["sourceId", "abilityName"],
  "lorcana.bag.resolve.pending.named.targets": ["sourceId", "abilityName", "targets"],
  "lorcana.bag.resolve.cancelled": ["sourceId", "cause"],
  "lorcana.bag.resolve.cancelled.named": ["sourceId", "abilityName", "cause"],
  "lorcana.effect.cancelled": ["sourceCardId", "cause"],
  "lorcana.effect.resolve.discardChoice": ["sourceCardId", "targets"],
  "lorcana.effect.resolve.targetSelection": ["sourceCardId", "targets"],
  "lorcana.effect.resolve.choiceSelection": ["sourceCardId", "choiceIndex"],
  "lorcana.effect.resolve.optionalSelection.accepted": ["sourceCardId"],
  "lorcana.effect.resolve.optionalSelection.accepted.targets": ["sourceCardId", "targets"],
  "lorcana.effect.resolve.optionalSelection.accepted.targets.named": [
    "sourceCardId",
    "abilityName",
    "targets",
  ],
  "lorcana.effect.resolve.optionalSelection.rejected": ["sourceCardId"],
  "lorcana.effect.resolve.nameCardSelection": ["sourceCardId", "namedCard"],
  "lorcana.effect.resolve.scrySelection": ["sourceCardId"],
  "lorcana.effect.resolve.scrySelection.detail": ["sourceCardId", "selection"],
  "lorcana.effect.resolve.revealTopCard": ["playerId", "revealedCardId", "targetPlayerId"],
  "lorcana.effect.resolve.revealTopCard.autoBottom": ["revealedCardId", "targetPlayerId"],
  "lorcana.effect.resolve.choiceSelection.withReveal": [
    "choiceIndex",
    "playerId",
    "revealedCardId",
  ],
  "lorcana.outcome.combatDamage": ["attackerId", "defenderId", "attackerDamage", "defenderDamage"],
  "lorcana.outcome.effectDamage": ["sourceId", "targetId", "amount"],
  "lorcana.outcome.damageMoved": ["sourceId", "targetId", "amount"],
  "lorcana.outcome.damagePrevented": ["targetId", "amount"],
  "lorcana.outcome.cardBanished": ["cardId"],
  "lorcana.outcome.cardsDrawn": ["amount"],
  "lorcana.outcome.cardsDrawn.detail": ["amount", "cardIds"],
  "lorcana.outcome.cardsDiscarded.detail": ["playerId", "amount", "cardIds"],
  "lorcana.outcome.cardReturnedToHand": ["cardId"],
  "lorcana.outcome.loreGained": ["playerId", "amount"],
  "lorcana.outcome.locationLoreGained": ["playerId", "amount", "locationCount"],
  "lorcana.outcome.loreLost": ["playerId", "amount"],
  "lorcana.outcome.cardExerted": ["cardId"],
  "lorcana.outcome.cardReadied": ["cardId"],
  "lorcana.outcome.cardsMilled": ["amount"],
  "lorcana.outcome.cardsPutOnBottom": ["cardIds"],
  "lorcana.move.playCard.shift": ["cardId", "shiftTargetId"],
  "lorcana.move.playCard.sing": ["cardId", "singerIds"],
  "lorcana.outcome.cardInked": ["cardId"],
  "lorcana.outcome.cardInkedExerted": ["cardId"],
  "lorcana.private.cardsDrawn.detail": ["cardIds"],
  "lorcana.private.setup.mulligan.detail": ["mulliganed", "drawn"],
  "lorcana.private.effect.lookAtInkwell.detail": ["cardIds"],
  "lorcana.private.effect.resolve.scrySelection.detail": ["sourceCardId", "selection"],
} as const satisfies {
  [K in LorcanaLogMessageKey]: readonly (keyof LorcanaLogMessageMap[K] & string)[];
};

// =============================================================================
// Typed Game Log Entry — discriminated union for the UI
// =============================================================================

export type LorcanaGameLogEntryCategory = "action" | "rules" | "system";

/**
 * A fully-typed game log entry. Each variant carries exactly the data
 * the UI needs to render that log type.
 *
 * Discriminated on `type` (which matches a LorcanaLogMessageKey).
 */
export type LorcanaGameLogEntry = {
  [K in LorcanaLogMessageKey]: {
    type: K;
    values: LorcanaLogMessageMap[K];
    visibility: LogVisibility;
    category: LorcanaGameLogEntryCategory;
  };
}[LorcanaLogMessageKey];

export function createLorcanaGameLogEntry<K extends LorcanaLogMessageKey>(
  type: K,
  values: LorcanaLogMessageMap[K],
  visibility: LogVisibility,
  category: LorcanaGameLogEntryCategory,
): Extract<LorcanaGameLogEntry, { type: K }> {
  return { type, values, visibility, category } as Extract<LorcanaGameLogEntry, { type: K }>;
}

/**
 * Creates a ProjectedLogEntry-compatible object with both `defaultMessage`
 * (for backward compat / i18n) and `typedEntry` (for the new typed pipeline).
 */
export type LorcanaLogProjection = {
  category: LorcanaGameLogEntryCategory;
  visibility: LogVisibility;
  defaultMessage: LogMessage;
  typedEntry: LorcanaGameLogEntry;
};

export function createLorcanaLogProjection<K extends LorcanaLogMessageKey>(
  key: K,
  values: LorcanaLogMessageMap[K],
  visibility: LogVisibility,
  category: LorcanaGameLogEntryCategory,
): LorcanaLogProjection {
  return {
    category,
    visibility,
    defaultMessage: { key, values: values as Record<string, LogValue> },
    typedEntry: { type: key, values, visibility, category } as LorcanaGameLogEntry,
  };
}

// =============================================================================
// Log Message Helpers
// =============================================================================

export function createLorcanaLogMessage(key: "lorcana.setup.done"): LogMessage;
export function createLorcanaLogMessage<
  TKey extends Exclude<LorcanaLogMessageKey, "lorcana.setup.done">,
>(key: TKey, values: LorcanaLogMessageMap[TKey]): LogMessage;
export function createLorcanaLogMessage(
  key: LorcanaLogMessageKey,
  values?: LorcanaLogMessageMap[LorcanaLogMessageKey],
): LogMessage {
  return { key, values: (values ?? {}) as Record<string, LogValue> };
}
