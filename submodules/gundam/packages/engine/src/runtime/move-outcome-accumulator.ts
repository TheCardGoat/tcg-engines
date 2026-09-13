import type { CardInstanceId, PlayerId } from "../types/branded.ts";
import type { GameLogEntry } from "../types/game-events.ts";
import type {
  GundamMoveOutcomeKind,
  GundamMoveOutcomeOrderEntry,
  GundamMoveOutcomes,
} from "../types/move-log.ts";
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
  private order: GundamMoveOutcomeOrderEntry[] = [];
  private resourcesSpent: GundamMoveOutcomes["resourcesSpent"];
  private cardsDiscarded: CardInstanceId[] = [];
  private unitsRested: CardInstanceId[] = [];
  private damageDealt: Array<NonNullable<GundamMoveOutcomes["damageDealt"]>[number]> = [];
  private hpRecovered: Array<NonNullable<GundamMoveOutcomes["hpRecovered"]>[number]> = [];
  private shieldsRemoved: Array<NonNullable<GundamMoveOutcomes["shieldsRemoved"]>[number]> = [];
  private unitsDefeated: Array<NonNullable<GundamMoveOutcomes["unitsDefeated"]>[number]> = [];
  private cardsDrawnCount = 0;
  private cardsDrawnIds: CardInstanceId[] = [];
  private cardsDrawnPlayerId: PlayerId | undefined;
  private cardsMoved: Array<NonNullable<GundamMoveOutcomes["cardsMoved"]>[number]> = [];
  private cardsReturnedToHand: CardInstanceId[] = [];
  private shieldsAddedToHand: GundamMoveOutcomes["shieldsAddedToHand"];
  private cardsReadied: CardInstanceId[] = [];
  private cardsExhausted: CardInstanceId[] = [];
  private statModifiers: Array<NonNullable<GundamMoveOutcomes["statModifiers"]>[number]> = [];
  private resourcesPlaced: Array<NonNullable<GundamMoveOutcomes["resourcesPlaced"]>[number]> = [];
  private effectsQueued: Array<NonNullable<GundamMoveOutcomes["effectsQueued"]>[number]> = [];
  private effectsResolved: Array<NonNullable<GundamMoveOutcomes["effectsResolved"]>[number]> = [];

  private mark(kind: GundamMoveOutcomeKind, index?: number): void {
    this.order.push(index === undefined ? { kind } : { kind, index });
  }

  private markAggregateOnce(kind: GundamMoveOutcomeKind): void {
    if (!this.order.some((entry) => entry.kind === kind)) this.mark(kind);
  }

  accumulate(entry: GameLogEntry): void {
    const values = valuesOf(entry);
    switch (entry.type) {
      case "gundam.cost.resourcesSpent":
        this.markAggregateOnce("resourcesSpent");
        this.resourcesSpent = {
          regularCount: typeof values.regularCount === "number" ? values.regularCount : 0,
          exRemovedCount: typeof values.exRemovedCount === "number" ? values.exRemovedCount : 0,
        };
        break;
      case "gundam.cost.cardsDiscarded":
      case "gundam.effect.cardsDiscarded":
        for (let index = 0; index < cardIds(values.cardIds).length; index += 1) {
          this.mark("cardsDiscarded", this.cardsDiscarded.length + index);
        }
        this.cardsDiscarded.push(...cardIds(values.cardIds));
        break;
      case "gundam.cost.unitsRested":
        for (let index = 0; index < cardIds(values.cardIds).length; index += 1) {
          this.mark("unitsRested", this.unitsRested.length + index);
        }
        this.unitsRested.push(...cardIds(values.cardIds));
        break;
      case "gundam.combat.damageDealt": {
        const targetId = cardId(values.cardId);
        const amount = typeof values.amount === "number" ? values.amount : 0;
        if (targetId && amount > 0) {
          this.mark("damageDealt", this.damageDealt.length);
          this.damageDealt.push({
            targetId,
            amount,
            ...(cardId(values.sourceCardId) ? { sourceCardId: cardId(values.sourceCardId)! } : {}),
            ...(values.attackKind === "direct" || values.attackKind === "fight"
              ? { attackKind: values.attackKind }
              : {}),
          });
        }
        break;
      }
      case "gundam.effect.hpRecovered": {
        const id = cardId(values.cardId);
        const amount = typeof values.amount === "number" ? values.amount : 0;
        if (id && amount > 0) {
          this.mark("hpRecovered", this.hpRecovered.length);
          this.hpRecovered.push({ cardId: id, amount });
        }
        break;
      }
      case "gundam.combat.shieldRemoved": {
        const id = cardId(values.cardId);
        const pid = playerId(values.playerId);
        if (id && pid) {
          this.mark("shieldsRemoved", this.shieldsRemoved.length);
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
          this.mark("unitsDefeated", this.unitsDefeated.length);
          this.unitsDefeated.push({
            cardId: id,
            ownerId,
            ...(cardId(values.defeatedBy) ? { defeatedBy: cardId(values.defeatedBy)! } : {}),
          });
        }
        break;
      }
      case "gundam.effect.cardsDrawn": {
        this.markAggregateOnce("cardsDrawn");
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
        if (id) {
          this.mark("cardsReturnedToHand", this.cardsReturnedToHand.length);
          this.cardsReturnedToHand.push(id);
        }
        break;
      }
      case "gundam.effect.shieldsAddedToHand": {
        const pid = playerId(values.playerId);
        const count = typeof values.count === "number" ? values.count : 0;
        if (pid && count > 0) {
          this.markAggregateOnce("shieldsAddedToHand");
          this.shieldsAddedToHand = {
            playerId: pid,
            count: (this.shieldsAddedToHand?.count ?? 0) + count,
          };
        }
        break;
      }
      case "gundam.effect.movedToZone": {
        const id = cardId(values.cardId);
        const to = typeof values.to === "string" ? values.to : undefined;
        if (id && to) {
          this.mark("cardsMoved", this.cardsMoved.length);
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
        if (id) {
          this.mark("cardsExhausted", this.cardsExhausted.length);
          this.cardsExhausted.push(id);
        }
        break;
      }
      case "gundam.effect.readied": {
        const id = cardId(values.cardId);
        if (id) {
          this.mark("cardsReadied", this.cardsReadied.length);
          this.cardsReadied.push(id);
        }
        break;
      }
      case "gundam.effect.statModified": {
        const id = cardId(values.cardId);
        if (
          id &&
          typeof values.stat === "string" &&
          typeof values.amount === "number" &&
          typeof values.duration === "string"
        ) {
          this.mark("statModifiers", this.statModifiers.length);
          this.statModifiers.push({
            cardId: id,
            stat: values.stat,
            amount: values.amount,
            duration: values.duration,
          });
        }
        break;
      }
      case "gundam.effect.resourcePlaced": {
        const pid = playerId(values.playerId);
        const id = cardId(values.cardId);
        if (pid && id && (values.state === "active" || values.state === "rested")) {
          this.mark("resourcesPlaced", this.resourcesPlaced.length);
          this.resourcesPlaced.push({ playerId: pid, cardId: id, state: values.state });
        }
        break;
      }
      case "gundam.pending.enqueued": {
        const sourceCardId = cardId(values.sourceCardId);
        const controllerId = playerId(values.controllerId);
        if (typeof values.effectId === "string" && sourceCardId && controllerId) {
          this.mark("effectsQueued", this.effectsQueued.length);
          this.effectsQueued.push({
            effectId: values.effectId,
            sourceCardId,
            controllerId,
            kind: typeof values.kind === "string" ? values.kind : "",
            ...(typeof values.timing === "string" ? { timing: values.timing } : {}),
          });
        }
        break;
      }
      case "gundam.pending.resolved": {
        const sourceCardId = cardId(values.sourceCardId);
        if (typeof values.effectId === "string" && sourceCardId) {
          this.mark("effectsResolved", this.effectsResolved.length);
          this.effectsResolved.push({ effectId: values.effectId, sourceCardId });
        }
        break;
      }
    }
  }

  flush(): GundamMoveOutcomes | undefined {
    const outcomes: GundamMoveOutcomes = {
      ...(this.order.length > 0 ? { order: [...this.order] } : {}),
      ...(this.resourcesSpent ? { resourcesSpent: this.resourcesSpent } : {}),
      ...(this.cardsDiscarded.length > 0 ? { cardsDiscarded: [...this.cardsDiscarded] } : {}),
      ...(this.unitsRested.length > 0 ? { unitsRested: [...this.unitsRested] } : {}),
      ...(this.damageDealt.length > 0 ? { damageDealt: [...this.damageDealt] } : {}),
      ...(this.hpRecovered.length > 0 ? { hpRecovered: [...this.hpRecovered] } : {}),
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
      ...(this.shieldsAddedToHand ? { shieldsAddedToHand: this.shieldsAddedToHand } : {}),
      ...(this.cardsReadied.length > 0 ? { cardsReadied: [...this.cardsReadied] } : {}),
      ...(this.cardsExhausted.length > 0 ? { cardsExhausted: [...this.cardsExhausted] } : {}),
      ...(this.statModifiers.length > 0 ? { statModifiers: [...this.statModifiers] } : {}),
      ...(this.resourcesPlaced.length > 0 ? { resourcesPlaced: [...this.resourcesPlaced] } : {}),
      ...(this.effectsQueued.length > 0 ? { effectsQueued: [...this.effectsQueued] } : {}),
      ...(this.effectsResolved.length > 0 ? { effectsResolved: [...this.effectsResolved] } : {}),
    };
    return Object.keys(outcomes).length > 0 ? outcomes : undefined;
  }
}
