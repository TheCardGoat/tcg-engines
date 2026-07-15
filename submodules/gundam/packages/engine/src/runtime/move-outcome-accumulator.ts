import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameLogEntry } from "../types/game-events.ts";
import type { GundamMoveOutcomes } from "../types/move-log.ts";
import { privateField } from "./private-field.ts";

function valuesOf(entry: GameLogEntry): Record<string, unknown> {
  return ((entry.data as { values?: Record<string, unknown> } | undefined)?.values ?? {}) as Record<
    string,
    unknown
  >;
}

function cardId(value: unknown): CardInstanceId | undefined {
  return typeof value === "string" ? (value as CardInstanceId) : undefined;
}

function playerId(value: unknown): PlayerId | undefined {
  return typeof value === "string" ? (value as PlayerId) : undefined;
}

function cardIds(value: unknown): CardInstanceId[] {
  return Array.isArray(value)
    ? value.filter((id): id is CardInstanceId => typeof id === "string")
    : [];
}

export class GundamMoveOutcomeAccumulator {
  private resourcesSpent: GundamMoveOutcomes["resourcesSpent"];
  private cardsDiscarded: CardInstanceId[] = [];
  private unitsRested: CardInstanceId[] = [];
  private damageDealt: Array<NonNullable<GundamMoveOutcomes["damageDealt"]>[number]> = [];
  private shieldsRemoved: Array<NonNullable<GundamMoveOutcomes["shieldsRemoved"]>[number]> = [];
  private unitsDefeated: Array<NonNullable<GundamMoveOutcomes["unitsDefeated"]>[number]> = [];
  private cardsDrawnCount = 0;
  private cardsDrawnIds: CardInstanceId[] = [];
  private cardsDrawnPlayerId: PlayerId | undefined;
  private cardsMoved: Array<NonNullable<GundamMoveOutcomes["cardsMoved"]>[number]> = [];
  private cardsReturnedToHand: CardInstanceId[] = [];
  private cardsReadied: CardInstanceId[] = [];
  private cardsExhausted: CardInstanceId[] = [];
  private resourcesPlaced: Array<NonNullable<GundamMoveOutcomes["resourcesPlaced"]>[number]> = [];
  private effectsQueued: Array<NonNullable<GundamMoveOutcomes["effectsQueued"]>[number]> = [];
  private effectsResolved: Array<NonNullable<GundamMoveOutcomes["effectsResolved"]>[number]> = [];

  accumulate(entry: GameLogEntry): void {
    const values = valuesOf(entry);
    switch (entry.type) {
      case "gundam.cost.resourcesSpent":
        this.resourcesSpent = {
          regularCount: typeof values.regularCount === "number" ? values.regularCount : 0,
          exRemovedCount: typeof values.exRemovedCount === "number" ? values.exRemovedCount : 0,
        };
        break;
      case "gundam.cost.cardsDiscarded":
      case "gundam.effect.cardsDiscarded":
        this.cardsDiscarded.push(...cardIds(values.cardIds));
        break;
      case "gundam.cost.unitsRested":
        this.unitsRested.push(...cardIds(values.cardIds));
        break;
      case "gundam.combat.damageDealt": {
        const targetId = cardId(values.cardId);
        const amount = typeof values.amount === "number" ? values.amount : 0;
        if (targetId && amount > 0) {
          this.damageDealt.push({
            targetId,
            amount,
            ...(cardId(values.sourceCardId) ? { sourceCardId: cardId(values.sourceCardId)! } : {}),
          });
        }
        break;
      }
      case "gundam.combat.shieldRemoved": {
        const id = cardId(values.cardId);
        const pid = playerId(values.playerId);
        if (id && pid) {
          this.shieldsRemoved.push({
            cardId: id,
            playerId: pid,
            ...(cardId(values.sourceCardId) ? { sourceCardId: cardId(values.sourceCardId)! } : {}),
          });
        }
        break;
      }
      case "gundam.combat.unitDefeated": {
        const id = cardId(values.cardId);
        const ownerId = playerId(values.ownerId);
        if (id && ownerId) {
          this.unitsDefeated.push({
            cardId: id,
            ownerId,
            ...(cardId(values.defeatedBy) ? { defeatedBy: cardId(values.defeatedBy)! } : {}),
          });
        }
        break;
      }
      case "gundam.effect.cardsDrawn": {
        const count = typeof values.count === "number" ? values.count : 0;
        const ids = cardIds(values.cardIds);
        if (ids.length === 0) {
          this.cardsDrawnCount += count;
        } else {
          this.cardsDrawnIds.push(...ids);
          if (this.cardsDrawnCount === 0) {
            this.cardsDrawnCount = count;
          }
        }
        this.cardsDrawnPlayerId = playerId(values.playerId) ?? this.cardsDrawnPlayerId;
        break;
      }
      case "gundam.effect.returnedToHand": {
        const id = cardId(values.cardId);
        if (id) this.cardsReturnedToHand.push(id);
        break;
      }
      case "gundam.effect.movedToZone": {
        const id = cardId(values.cardId);
        const to = typeof values.to === "string" ? values.to : undefined;
        if (id && to) {
          this.cardsMoved.push({
            cardId: id,
            ...(typeof values.from === "string" ? { from: values.from } : {}),
            to,
          });
        }
        break;
      }
      case "gundam.effect.exhausted": {
        const id = cardId(values.cardId);
        if (id) this.cardsExhausted.push(id);
        break;
      }
      case "gundam.effect.readied": {
        const id = cardId(values.cardId);
        if (id) this.cardsReadied.push(id);
        break;
      }
      case "gundam.effect.resourcePlaced": {
        const pid = playerId(values.playerId);
        const id = cardId(values.cardId);
        if (pid && id && (values.state === "active" || values.state === "rested")) {
          this.resourcesPlaced.push({ playerId: pid, cardId: id, state: values.state });
        }
        break;
      }
      case "gundam.pending.enqueued": {
        const sourceCardId = cardId(values.sourceCardId);
        const controllerId = playerId(values.controllerId);
        if (typeof values.effectId === "string" && sourceCardId && controllerId) {
          this.effectsQueued.push({
            effectId: values.effectId,
            sourceCardId,
            controllerId,
            kind: typeof values.kind === "string" ? values.kind : "",
          });
        }
        break;
      }
      case "gundam.pending.resolved": {
        const sourceCardId = cardId(values.sourceCardId);
        if (typeof values.effectId === "string" && sourceCardId) {
          this.effectsResolved.push({ effectId: values.effectId, sourceCardId });
        }
        break;
      }
    }
  }

  flush(): GundamMoveOutcomes | undefined {
    const outcomes: GundamMoveOutcomes = {
      ...(this.resourcesSpent ? { resourcesSpent: this.resourcesSpent } : {}),
      ...(this.cardsDiscarded.length > 0 ? { cardsDiscarded: [...this.cardsDiscarded] } : {}),
      ...(this.unitsRested.length > 0 ? { unitsRested: [...this.unitsRested] } : {}),
      ...(this.damageDealt.length > 0 ? { damageDealt: [...this.damageDealt] } : {}),
      ...(this.shieldsRemoved.length > 0 ? { shieldsRemoved: [...this.shieldsRemoved] } : {}),
      ...(this.unitsDefeated.length > 0 ? { unitsDefeated: [...this.unitsDefeated] } : {}),
      ...(this.cardsDrawnCount > 0
        ? {
            cardsDrawn: {
              count: this.cardsDrawnCount,
              ...(this.cardsDrawnPlayerId ? { playerId: this.cardsDrawnPlayerId } : {}),
              ...(this.cardsDrawnIds.length > 0 && this.cardsDrawnPlayerId
                ? { cardIds: privateField([...this.cardsDrawnIds], [this.cardsDrawnPlayerId]) }
                : {}),
            },
          }
        : {}),
      ...(this.cardsMoved.length > 0 ? { cardsMoved: [...this.cardsMoved] } : {}),
      ...(this.cardsReturnedToHand.length > 0
        ? { cardsReturnedToHand: [...this.cardsReturnedToHand] }
        : {}),
      ...(this.cardsReadied.length > 0 ? { cardsReadied: [...this.cardsReadied] } : {}),
      ...(this.cardsExhausted.length > 0 ? { cardsExhausted: [...this.cardsExhausted] } : {}),
      ...(this.resourcesPlaced.length > 0 ? { resourcesPlaced: [...this.resourcesPlaced] } : {}),
      ...(this.effectsQueued.length > 0 ? { effectsQueued: [...this.effectsQueued] } : {}),
      ...(this.effectsResolved.length > 0 ? { effectsResolved: [...this.effectsResolved] } : {}),
    };
    return Object.keys(outcomes).length > 0 ? outcomes : undefined;
  }
}
