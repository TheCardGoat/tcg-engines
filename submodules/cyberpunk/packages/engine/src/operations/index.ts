import type { Draft } from "mutative";
import type { CardZone } from "@tcg/cyberpunk-types";
import type {
  GameState,
  GameEvent,
  PendingChoice,
  BagEntry,
  ActiveEffect,
} from "../types/index.ts";
import type { CardInstanceId, PlayerId, GigDieId } from "../types/branded.ts";
import { createDefaultMetaForZone, type CardMeta } from "../types/card-instance.ts";
import type { DieType } from "../types/gig-die.ts";
import type { MoveLog } from "../logging/move-log.ts";
import { spendReadyLegendsForEddies } from "../moves/eddie-resources.ts";

export interface Operations {
  readonly zone: ZoneOperations;
  readonly card: CardOperations;
  readonly game: GameOperations;
  readonly gig: GigOperations;
  readonly event: EventOperations;
  readonly log: LogOperations;
}

export interface ZoneOperations {
  moveCard(
    cardId: CardInstanceId,
    toZone: CardZone,
    playerId?: PlayerId,
    opts?: { index?: number },
  ): void;
  drawCards(playerId: PlayerId, count: number): CardInstanceId[];
  shuffleDeck(playerId: PlayerId, pickIndex: (maxInclusive: number) => number): void;
  moveCardsToTop(playerId: PlayerId, cardIds: CardInstanceId[]): void;
  moveCardsToBottom(playerId: PlayerId, cardIds: CardInstanceId[]): void;
}

export interface CardOperations {
  spend(cardId: CardInstanceId): void;
  ready(cardId: CardInstanceId): void;
  setMeta(cardId: CardInstanceId, patch: Partial<CardMeta>): void;
  attachGear(gearId: CardInstanceId, hostId: CardInstanceId): void;
  detachGear(gearId: CardInstanceId): void;
  moveAttachedGear(hostId: CardInstanceId, toZone: CardZone): void;
  setPlayedThisTurn(cardId: CardInstanceId, value: boolean): void;
  setAttackedThisTurn(cardId: CardInstanceId, value: boolean): void;
}

export interface GameOperations {
  spendEddies(playerId: PlayerId, amount: number, forWhat: string): void;
  gainEddies(playerId: PlayerId, amount: number): void;
  setPhase(phase: import("../types/match-state.ts").GamePhase): void;
  setAttackState(attack: import("../types/match-state.ts").AttackState | null): void;
  addActiveEffect(effect: ActiveEffect): void;
  removeActiveEffect(effectId: string): void;
  cleanupTurnEffects(): void;
  cleanupEffectsExpiringAtTurnStart(playerId: PlayerId): void;
  addBagEntry(entry: BagEntry): void;
  removeBagEntry(entryId: string): void;
  setPendingChoice(choice: PendingChoice | undefined): void;
  endGame(winnerId: PlayerId | null, reason: string): void;
  setTurnMetadata(patch: Partial<import("../types/match-state.ts").TurnMetadata>): void;
  markSoldThisTurn(playerId: PlayerId): void;
  markCalledLegendThisTurn(playerId: PlayerId): void;
  markCalledLegendThisRivalTurn(playerId: PlayerId): void;
  resetTurnFlags(playerId: PlayerId): void;
}

export interface GigOperations {
  takeFromFixer(playerId: PlayerId, dieId: GigDieId, rollDie: (dieType: DieType) => number): void;
  moveGig(dieId: GigDieId, toPlayerId: PlayerId, sourceCardId?: CardInstanceId): void;
  setGigValue(dieId: GigDieId, value: number): void;
}

export interface EventOperations {
  emit(event: GameEvent): void;
  getEmittedEvents(): GameEvent[];
}

/**
 * Per-command log buffer. A move handler should call {@link LogOperations.emit}
 * exactly once with its primary, player-attributed log. The processor will
 * synthesize follow-on system logs (turnStarted/turnEnded/gameEnded) from any
 * matching events emitted in the same command.
 */
export interface LogOperations {
  emit(log: MoveLog): void;
  getEmittedLogs(): MoveLog[];
}

export function createOperations(
  G: Draft<GameState>,
  events: GameEvent[],
  logs: MoveLog[],
): Operations {
  function checkOvertimeMajority() {
    if (!G.overtime || G.gameEnded) return;
    const totalDice = Object.keys(G.gigDice).length;
    const majority = Math.floor(totalDice / 2) + 1;
    for (const pid of Object.keys(G.players)) {
      const p = G.players[pid];
      if (p && p.gigArea.length >= majority) {
        G.gameEnded = true;
        G.winnerId = pid as PlayerId;
        G.winReason = "overtime_majority";
        G.gamePhase = "end";
        events.push({ type: "gameEnded", winnerId: pid as PlayerId, reason: "overtime_majority" });
        return;
      }
    }
  }

  const zone: ZoneOperations = {
    moveCard(cardId, toZone, playerId, opts) {
      const card = G.cardIndex[cardId as string];
      if (!card) return;

      const fromZone = card.zone;
      const owner = playerId ?? card.ownerId;

      const playerState = G.players[owner as string];
      if (!playerState) return;

      const fromList = playerState.zones[fromZone];
      const idx = fromList.indexOf(cardId);
      if (idx !== -1) fromList.splice(idx, 1);

      const toList = playerState.zones[toZone];
      if (opts?.index !== undefined) {
        toList.splice(opts.index, 0, cardId);
      } else {
        toList.push(cardId);
      }

      card.zone = toZone;
      if (fromZone !== toZone) {
        card.meta = createDefaultMetaForZone(toZone, {
          attachedGearIds: [...card.meta.attachedGearIds],
          attachedToId: card.meta.attachedToId,
        });
      }

      events.push({
        type: "cardMoved",
        cardId,
        fromZone,
        toZone,
        playerId: owner,
      });
    },

    drawCards(playerId, count) {
      const playerState = G.players[playerId as string];
      if (!playerState) return [];

      const drawn: CardInstanceId[] = [];
      for (let i = 0; i < count; i++) {
        const cardId = playerState.zones.deck.shift();
        if (!cardId) break;
        const card = G.cardIndex[cardId as string];
        if (card) {
          card.zone = "hand";
          card.meta = createDefaultMetaForZone("hand");
        }
        playerState.zones.hand.push(cardId);
        drawn.push(cardId);
      }

      if (drawn.length > 0) {
        events.push({
          type: "cardsDrawn",
          playerId,
          count: drawn.length,
          cardIds: drawn,
        });

        if (playerState.zones.deck.length === 0 && !G.gameEnded) {
          const opponentId = Object.keys(G.players).find((id) => id !== playerId) as
            | PlayerId
            | undefined;
          if (opponentId) {
            G.gameEnded = true;
            G.winnerId = opponentId;
            G.winReason = "deck_out_victory";
            G.gamePhase = "end";
            events.push({
              type: "gameEnded",
              winnerId: opponentId,
              reason: "deck_out_victory",
            });
          }
        }
      }

      return drawn;
    },

    shuffleDeck(playerId, pickIndex) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;

      const deck = [...playerState.zones.deck];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = pickIndex(i);
        [deck[i], deck[j]] = [deck[j]!, deck[i]!];
      }
      playerState.zones.deck = deck;

      events.push({ type: "deckShuffled", playerId });
    },

    moveCardsToTop(playerId, cardIds) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;
      playerState.zones.deck = [...cardIds, ...playerState.zones.deck];
    },

    moveCardsToBottom(playerId, cardIds) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;
      playerState.zones.deck = [...playerState.zones.deck, ...cardIds];
    },
  };

  const card: CardOperations = {
    spend(cardId) {
      const c = G.cardIndex[cardId as string];
      if (!c) return;
      c.meta.spent = true;
      events.push({ type: "cardSpent", cardId, playerId: c.controllerId });
    },

    ready(cardId) {
      const c = G.cardIndex[cardId as string];
      if (!c) return;
      c.meta.spent = false;
      events.push({ type: "cardReadied", cardId, playerId: c.controllerId });
    },

    setMeta(cardId, patch) {
      const c = G.cardIndex[cardId as string];
      if (!c) return;
      Object.assign(c.meta, patch);
    },

    attachGear(gearId, hostId) {
      const gear = G.cardIndex[gearId as string];
      const host = G.cardIndex[hostId as string];
      if (!gear || !host) return;

      gear.meta.attachedToId = hostId;
      host.meta.attachedGearIds.push(gearId);

      events.push({
        type: "cardAttached",
        gearId,
        hostId,
        playerId: host.controllerId,
      });
    },

    detachGear(gearId) {
      const gear = G.cardIndex[gearId as string];
      if (!gear || !gear.meta.attachedToId) return;

      const host = G.cardIndex[gear.meta.attachedToId as string];
      if (host) {
        const idx = host.meta.attachedGearIds.indexOf(gearId);
        if (idx !== -1) host.meta.attachedGearIds.splice(idx, 1);
      }

      events.push({
        type: "cardDetached",
        gearId,
        hostId: gear.meta.attachedToId,
        playerId: gear.controllerId,
      });

      gear.meta.attachedToId = null;
    },

    moveAttachedGear(hostId, toZone) {
      const host = G.cardIndex[hostId as string];
      if (!host) return;

      const gearIds = [...host.meta.attachedGearIds];
      for (const gearId of gearIds) {
        card.detachGear(gearId);
        zone.moveCard(gearId, toZone, host.ownerId);
      }
    },

    setPlayedThisTurn(cardId, value) {
      const c = G.cardIndex[cardId as string];
      if (c) c.meta.playedThisTurn = value;
    },

    setAttackedThisTurn(cardId, value) {
      const c = G.cardIndex[cardId as string];
      if (c) c.meta.hasAttackedThisTurn = value;
    },
  };

  const game: GameOperations = {
    spendEddies(playerId, amount, forWhat) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;
      const eddiePoolSpent = Math.min(playerState.eddies, amount);
      playerState.eddies -= eddiePoolSpent;

      let remaining = eddiePoolSpent;
      for (const cardId of playerState.eddieCardIds) {
        if (remaining <= 0) break;
        const card = G.cardIndex[cardId as string];
        if (!card || card.meta.spent) continue;
        card.meta.spent = true;
        remaining--;
        events.push({ type: "cardSpent", cardId, playerId: card.controllerId });
      }

      const legendEddiesNeeded = amount - eddiePoolSpent;
      const legendIds = spendReadyLegendsForEddies(G as GameState, playerId, legendEddiesNeeded);
      for (const cardId of legendIds) {
        const card = G.cardIndex[cardId as string];
        if (!card) continue;
        card.meta.spent = true;
        events.push({ type: "cardSpent", cardId, playerId: card.controllerId });
      }

      playerState.spentEddies = (playerState.spentEddies ?? 0) + eddiePoolSpent;
      events.push({ type: "eddiesSpent", playerId, amount, forWhat });
    },

    gainEddies(playerId, amount) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;
      playerState.eddies += amount;
      events.push({ type: "eddiesGained", playerId, amount });
    },

    setPhase(phase) {
      const prev = G.gamePhase;
      G.gamePhase = phase;
      events.push({
        type: "phaseChanged",
        from: prev,
        to: phase,
        playerId: G.turnMetadata.activePlayerId,
      });
    },

    setAttackState(attack) {
      G.attackState = attack;
    },

    addActiveEffect(effect) {
      G.activeEffects.push(effect);
      G.nextEffectId++;
    },

    removeActiveEffect(effectId) {
      G.activeEffects = G.activeEffects.filter((e) => e.id !== effectId);
    },

    cleanupTurnEffects() {
      G.activeEffects = G.activeEffects.filter(
        (e) => !(e.origin === "imperative" && e.duration === "turn"),
      );
    },

    cleanupEffectsExpiringAtTurnStart(playerId) {
      G.activeEffects = G.activeEffects.filter(
        (e) =>
          !(
            e.origin === "imperative" &&
            e.duration === "untilSourceNextTurn" &&
            e.expiresAtStartOfTurnForPlayerId === playerId
          ),
      );
    },

    addBagEntry(entry) {
      G.effectBag.push(entry);
    },

    removeBagEntry(entryId) {
      G.effectBag = G.effectBag.filter((e) => e.id !== entryId);
    },

    setPendingChoice(choice) {
      G.turnMetadata.pendingChoice = choice;
    },

    endGame(winnerId, reason) {
      G.gameEnded = true;
      G.winnerId = winnerId;
      G.winReason = reason;
      G.gamePhase = "end";
      events.push({ type: "gameEnded", winnerId, reason });
    },

    setTurnMetadata(patch) {
      Object.assign(G.turnMetadata, patch);
      if (patch.overtimeActive !== undefined) {
        G.overtime = patch.overtimeActive;
      }
    },

    markSoldThisTurn(playerId) {
      const p = G.players[playerId as string];
      if (p) p.soldThisTurn = true;
    },

    markCalledLegendThisTurn(playerId) {
      const p = G.players[playerId as string];
      if (p) p.calledLegendThisTurn = true;
    },

    markCalledLegendThisRivalTurn(playerId) {
      const p = G.players[playerId as string];
      if (p) p.calledLegendThisRivalTurn = true;
    },

    resetTurnFlags(playerId) {
      const p = G.players[playerId as string];
      if (!p) return;
      p.soldThisTurn = false;
      p.calledLegendThisTurn = false;
      p.calledLegendThisRivalTurn = false;

      G.turnMetadata.abilityFiredThisTurn = [];
      G.turnMetadata.triggerQueue = [];
      G.turnMetadata.currentTrigger = undefined;

      for (const cardId of p.zones.field) {
        const c = G.cardIndex[cardId as string];
        if (c) {
          c.meta.playedThisTurn = false;
          c.meta.hasAttackedThisTurn = false;
        }
      }
    },
  };

  const gig: GigOperations = {
    takeFromFixer(playerId, dieId, rollDie) {
      const playerState = G.players[playerId as string];
      if (!playerState) return;

      const die = G.gigDice[dieId as string];
      if (!die) return;

      const idx = playerState.fixerArea.indexOf(dieId);
      if (idx === -1) return;
      playerState.fixerArea.splice(idx, 1);

      const faceValue = rollDie(die.dieType);
      die.faceValue = faceValue;
      die.location = "gigArea";
      playerState.gigArea.push(dieId);

      events.push({
        type: "gigDieRolled",
        dieId,
        dieType: die.dieType,
        result: faceValue,
        playerId,
      });
      events.push({
        type: "gigDieMoved",
        dieId,
        from: "fixerArea",
        to: "gigArea",
        playerId,
      });
      checkOvertimeMajority();
    },

    moveGig(dieId, toPlayerId, sourceCardId?) {
      const die = G.gigDice[dieId as string];
      if (!die) return;

      const fromPlayerId = die.ownerId;
      const fromPlayer = G.players[fromPlayerId as string];
      const toPlayer = G.players[toPlayerId as string];
      if (!fromPlayer || !toPlayer) return;

      const idx = fromPlayer.gigArea.indexOf(dieId);
      if (idx !== -1) fromPlayer.gigArea.splice(idx, 1);

      die.ownerId = toPlayerId;
      toPlayer.gigArea.push(dieId);

      events.push({
        type: "gigStolen",
        dieId,
        fromPlayerId,
        toPlayerId,
        sourceCardId,
      });
      events.push({
        type: "gigDieMoved",
        dieId,
        from: "gigArea",
        to: "gigArea",
        playerId: toPlayerId,
      });
      checkOvertimeMajority();
    },

    setGigValue(dieId, value) {
      const die = G.gigDice[dieId as string];
      if (!die) return;
      const prev = die.faceValue;
      die.faceValue = value;
      events.push({
        type: "gigValueChanged",
        dieId,
        previousValue: prev,
        newValue: value,
        playerId: die.ownerId,
      });
    },
  };

  const event: EventOperations = {
    emit(event) {
      events.push(event);
    },
    getEmittedEvents() {
      return events;
    },
  };

  const log: LogOperations = {
    emit(entry) {
      logs.push(entry);
    },
    getEmittedLogs() {
      return logs;
    },
  };

  return { zone, card, game, gig, event, log };
}
