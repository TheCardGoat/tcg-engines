/**
 * MoveOutcomeAccumulator
 *
 * Collects structured MoveOutcomes from domain events during move execution.
 * Ports the event-mapping logic from lorcana-log-projector.ts but produces
 * a single MoveOutcomes object instead of separate log entries.
 */

import type { CardInstanceId, LogProjectionContext, PlayerId, PublishedGameEvent } from "#core";
import { privateField } from "../core/runtime/private-field";
import type { DamageEntry, MovedDamageEntry, MoveOutcomes } from "../types/move-log";
import type {
  CardBanishedPayload,
  CardsDiscardedPayload,
  CardExertedPayload,
  CardInkedPayload,
  CardMovedPayload,
  CardReadiedPayload,
  CardReturnedToHandPayload,
  CardsDrawnPayload,
  DamageDealtPayload,
  DamageMovedPayload,
  LoreChangedPayload,
  LorcanaDomainEventType,
} from "../types/domain-events";

function assertNever(value: never): never {
  throw new Error(`Unhandled customType: ${String(value)}`);
}

export class MoveOutcomeAccumulator {
  private damageDealt: DamageEntry[] = [];
  private damageMoved: MovedDamageEntry[] = [];
  private cardsBanished: CardInstanceId[] = [];
  private cardsDrawn: Array<{ playerId: PlayerId; amount: number; detail: CardInstanceId[] }> = [];
  private cardsDiscarded: NonNullable<MoveOutcomes["cardsDiscarded"]> = [];
  private loreChanges: MoveOutcomes["loreChanged"][] = [];
  private cardsExerted: CardInstanceId[] = [];
  private cardsReadied: CardInstanceId[] = [];
  private cardsMilled: { playerId: PlayerId; amount: number; cardIds: CardInstanceId[] } | null =
    null;
  private cardsReturnedToHand: CardInstanceId[] = [];
  private cardsMovedToZone: Array<{ cardId: CardInstanceId; zone: string }> = [];
  private cardsInked: NonNullable<MoveOutcomes["cardsInked"]> = [];

  accumulate(event: PublishedGameEvent, context: LogProjectionContext): void {
    const gameEvent = event.event;

    if (gameEvent.kind === "DAMAGE_DEALT") {
      this.accumulateDamageDealt(gameEvent);
      return;
    }

    if (gameEvent.kind === "CARDS_MILLED") {
      this.accumulateCardsMilled(gameEvent);
      return;
    }

    if (gameEvent.kind !== "CUSTOM") return;

    const customType = gameEvent.customType as LorcanaDomainEventType;

    switch (customType) {
      case "challenged":
        this.accumulateChallenged(
          gameEvent.data as {
            attackerId: string;
            defenderId: string;
            attackerDamage: number;
            defenderDamage: number;
          },
        );
        break;
      case "damageDealt":
        this.accumulateLorcanaDamageDealt(gameEvent.data as DamageDealtPayload);
        break;
      case "damageMoved":
        this.accumulateDamageMoved(gameEvent.data as DamageMovedPayload);
        break;
      case "cardBanished":
        this.accumulateCardBanished(gameEvent.data as CardBanishedPayload);
        break;
      case "cardsDrawn":
        this.accumulateCardsDrawn(gameEvent.data as CardsDrawnPayload);
        break;
      case "cardsDiscarded":
        this.accumulateCardsDiscarded(gameEvent.data as CardsDiscardedPayload);
        break;
      case "cardReturnedToHand":
        this.accumulateCardReturnedToHand(gameEvent.data as CardReturnedToHandPayload);
        break;
      case "cardMoved":
        this.accumulateCardMoved(gameEvent.data as CardMovedPayload);
        break;
      case "loreChanged":
        this.accumulateLoreChanged(gameEvent.data as LoreChangedPayload);
        break;
      case "cardExerted":
        this.accumulateCardExerted(gameEvent.data as CardExertedPayload, context);
        break;
      case "cardReadied":
        this.accumulateCardReadied(gameEvent.data as CardReadiedPayload, context);
        break;
      case "cardInked":
        this.accumulateCardInked(gameEvent.data as CardInkedPayload);
        break;
      // Domain events that do not contribute to MoveOutcomes — listed
      // explicitly so the exhaustiveness check in `default` catches any
      // newly-added LorcanaDomainEventType.
      case "allCardsReadied":
      case "inkChanged":
      case "questCompleted":
      case "turnPassed":
      case "cardPlayed":
      case "quested":
      case "firstPlayerChosen":
      case "handAltered":
      case "deckShuffled":
      case "zoneBottomShuffled":
      case "challengeCleared":
      case "abilityActivated":
      case "putCardUnder":
      case "cardLeftDiscard":
        break;
      default:
        assertNever(customType);
    }
  }

  flush(): MoveOutcomes | undefined {
    const outcomes: MoveOutcomes = {};
    let hasAny = false;

    if (this.damageDealt.length > 0) {
      outcomes.damageDealt = [...this.damageDealt];
      hasAny = true;
    }

    if (this.damageMoved.length > 0) {
      outcomes.damageMoved = [...this.damageMoved];
      hasAny = true;
    }

    if (this.cardsBanished.length > 0) {
      outcomes.cardsBanished = [...this.cardsBanished];
      hasAny = true;
    }

    if (this.cardsDrawn.length > 0) {
      outcomes.cardsDrawn = this.cardsDrawn.map((entry) => ({
        playerId: entry.playerId,
        amount: entry.amount,
        ...(entry.detail.length > 0 && {
          detail: privateField([...entry.detail], [entry.playerId]),
        }),
      }));
      hasAny = true;
    }

    if (this.cardsDiscarded.length > 0) {
      outcomes.cardsDiscarded = this.cardsDiscarded.map((entry) => ({
        playerId: entry.playerId,
        amount: entry.amount,
        detail: [...entry.detail],
      }));
      hasAny = true;
    }

    // Use the last lore change (most recent). Multiple lore changes in a single
    // move are rare; when they occur the last one represents the final state.
    for (let i = this.loreChanges.length - 1; i >= 0; i--) {
      if (this.loreChanges[i]) {
        outcomes.loreChanged = this.loreChanges[i];
        hasAny = true;
        break;
      }
    }

    if (this.cardsExerted.length > 0) {
      outcomes.cardsExerted = [...this.cardsExerted];
      hasAny = true;
    }

    if (this.cardsReadied.length > 0) {
      outcomes.cardsReadied = [...this.cardsReadied];
      hasAny = true;
    }

    if (this.cardsMilled) {
      outcomes.cardsMilled = {
        playerId: this.cardsMilled.playerId,
        amount: this.cardsMilled.amount,
        ...(this.cardsMilled.cardIds.length > 0 && {
          cardIds: privateField([...this.cardsMilled.cardIds], [this.cardsMilled.playerId]),
        }),
      };
      hasAny = true;
    }

    if (this.cardsReturnedToHand.length > 0) {
      outcomes.cardsReturnedToHand = [...this.cardsReturnedToHand];
      hasAny = true;
    }

    if (this.cardsInked.length > 0) {
      outcomes.cardsInked = [...this.cardsInked];
      hasAny = true;
    }

    if (this.cardsMovedToZone.length > 0) {
      outcomes.cardsMovedToZone = [...this.cardsMovedToZone];
      hasAny = true;
    }

    this.reset();
    return hasAny ? outcomes : undefined;
  }

  private reset(): void {
    this.damageDealt = [];
    this.damageMoved = [];
    this.cardsBanished = [];
    this.cardsDrawn = [];
    this.cardsDiscarded = [];
    this.loreChanges = [];
    this.cardsExerted = [];
    this.cardsReadied = [];
    this.cardsMilled = null;
    this.cardsReturnedToHand = [];
    this.cardsMovedToZone = [];
    this.cardsInked = [];
  }

  // ── Event handlers ────────────────────────────────────────────

  private accumulateChallenged(data: {
    attackerId: string;
    defenderId: string;
    attackerDamage: number;
    defenderDamage: number;
  }): void {
    // attackerDamage = defenderToAttackerDamage (damage the attacker RECEIVES from the defender)
    // defenderDamage = attackerToDefenderDamage (damage the defender RECEIVES from the attacker)
    // So: attacker deals defenderDamage to the defender, and defender deals attackerDamage to the attacker.
    this.damageDealt.push(
      {
        sourceId: data.attackerId as CardInstanceId,
        targetId: data.defenderId as CardInstanceId,
        amount: data.defenderDamage,
        kind: "combat",
      },
      {
        sourceId: data.defenderId as CardInstanceId,
        targetId: data.attackerId as CardInstanceId,
        amount: data.attackerDamage,
        kind: "combat",
      },
    );
  }

  private accumulateDamageDealt(gameEvent: {
    kind: "DAMAGE_DEALT";
    sourceCardId?: string;
    targetCardId?: string;
    amount: number;
    damageKind: "combat" | "effect" | "loss_of_life";
  }): void {
    // Skip combat damage — already covered by the challenged domain event
    if (gameEvent.damageKind === "combat") return;
    if (!gameEvent.sourceCardId || !gameEvent.targetCardId) return;
    if (gameEvent.amount <= 0) return;

    this.damageDealt.push({
      sourceId: gameEvent.sourceCardId as CardInstanceId,
      targetId: gameEvent.targetCardId as CardInstanceId,
      amount: gameEvent.amount,
      kind: "effect",
    });
  }

  private accumulateLorcanaDamageDealt(payload: DamageDealtPayload): void {
    if (!("damageType" in payload)) return;
    if (payload.damageType === "combat") return;
    if (payload.damageType === "put") return;
    if (!payload.sourceId) return;
    if (payload.amount <= 0) return;

    this.damageDealt.push({
      sourceId: payload.sourceId,
      targetId: payload.targetId,
      amount: payload.amount,
      kind: "effect",
    });
  }

  private accumulateCardBanished(data: CardBanishedPayload): void {
    this.cardsBanished.push(data.cardId as CardInstanceId);
  }

  private accumulateCardsDrawn(data: CardsDrawnPayload): void {
    // Skip manual/debug draws
    if ("isManual" in data && (data as { isManual?: boolean }).isManual) return;
    // Mandatory turn draws are routed to the canonical turnStart log, not move outcomes.
    if (data.source === "mandatory-draw") return;

    const existing = this.cardsDrawn.find((entry) => entry.playerId === data.playerId);
    if (existing) {
      existing.amount += data.amount;
      existing.detail.push(...(data.cardIds ?? []));
      return;
    }

    this.cardsDrawn.push({
      playerId: data.playerId,
      amount: data.amount,
      detail: [...(data.cardIds ?? [])],
    });
  }

  private accumulateCardsDiscarded(data: CardsDiscardedPayload): void {
    if (data.amount <= 0) return;

    const existing = this.cardsDiscarded.find((entry) => entry.playerId === data.playerId);
    if (existing) {
      existing.amount += data.amount;
      existing.detail.push(...data.cardIds);
      return;
    }

    this.cardsDiscarded.push({
      playerId: data.playerId,
      amount: data.amount,
      detail: [...data.cardIds],
    });
  }

  private accumulateCardReturnedToHand(data: CardReturnedToHandPayload): void {
    this.cardsReturnedToHand.push(data.cardId as CardInstanceId);
  }

  private accumulateCardMoved(data: CardMovedPayload): void {
    if ("isManual" in data && data.isManual) {
      return;
    }

    this.cardsMovedToZone.push({
      cardId: data.cardId as CardInstanceId,
      zone: data.toZone,
    });
  }

  private accumulateLoreChanged(data: LoreChangedPayload): void {
    // Skip manual/debug lore changes
    if ("isManual" in data && (data as { isManual?: boolean }).isManual) return;
    // Skip quest-sourced lore changes (already in the quest move log)
    if ("source" in data && (data as { source?: string }).source === "quest") return;

    const typedData = data as {
      playerId: PlayerId;
      operation: "add" | "remove" | "set";
      amount: number;
    };

    if (typedData.operation === "add" && typedData.amount > 0) {
      this.loreChanges.push({
        playerId: typedData.playerId,
        amount: typedData.amount,
        operation: "add",
      });
    } else if (typedData.operation === "remove" && typedData.amount > 0) {
      this.loreChanges.push({
        playerId: typedData.playerId,
        amount: typedData.amount,
        operation: "remove",
      });
    }
  }

  private accumulateCardExerted(data: CardExertedPayload, context: LogProjectionContext): void {
    if (data.isManual) return;
    if (data.source === "quest" || data.source === "challenge") return;

    const cardId = data.cardId as CardInstanceId;
    this.cardsExerted.push(cardId);
  }

  private accumulateCardReadied(data: CardReadiedPayload, context: LogProjectionContext): void {
    if (data.isManual) return;
    if (data.source === "start-of-turn" && data.zone === "inkwell") return;

    const cardId = data.cardId as CardInstanceId;
    this.cardsReadied.push(cardId);
  }

  private accumulateCardsMilled(gameEvent: {
    kind: "CARDS_MILLED";
    cardIds: string[];
    playerId?: string;
  }): void {
    if (!gameEvent.playerId) return;

    this.cardsMilled = {
      playerId: gameEvent.playerId as PlayerId,
      amount: gameEvent.cardIds.length,
      cardIds: gameEvent.cardIds as CardInstanceId[],
    };
  }

  private accumulateCardInked(data: CardInkedPayload): void {
    const cardId = data.cardId as CardInstanceId;
    if (data.private) {
      this.cardsInked.push({
        cardId: privateField(cardId, [data.playerId]),
        exerted: data.exerted ?? true,
      });
      return;
    }
    this.cardsInked.push({
      cardId,
      exerted: data.exerted ?? true,
    });
  }

  private accumulateDamageMoved(data: DamageMovedPayload): void {
    if (data.amount <= 0) return;
    this.damageMoved.push({
      sourceCharacterId: data.sourceCharacterId,
      targetId: data.targetId,
      amount: data.amount,
    });
  }
}
