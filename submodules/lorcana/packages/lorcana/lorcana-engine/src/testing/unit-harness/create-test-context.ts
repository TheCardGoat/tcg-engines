import type { CardInstanceId, PlayerId } from "#core";
import type { PlayCardExecutionContext } from "../../runtime-moves/resolution/action-effects/types";
import { PLAYER_ONE, PLAYER_TWO, type TestCardDefinition } from "./fixtures";

export type CreateTestContextArgs = {
  /** Turn number reported by framework.state.status.turn. Defaults to 1. */
  turn?: number;
  /** One Time Player override (status.otp). */
  otp?: PlayerId;
  /** Which player currently has priority. Defaults to PLAYER_ONE. */
  currentPlayer?: PlayerId;
  /** playerId used as the move-execution perspective. Defaults to currentPlayer. */
  playerId?: PlayerId;
  /** Static card definitions keyed by CardInstanceId. */
  definitions?: Record<string, TestCardDefinition>;
  /** Initial per-card meta (damage, state, keyword grants, etc). */
  cardMeta?: Record<string, Record<string, unknown>>;
  /** Zone contents keyed by `${zone}:${playerId}`. Accepts plain strings; the
   * harness brands them as `CardInstanceId` internally so tests don't need to
   * sprinkle `as CardInstanceId` casts across every zone fixture. */
  zoneCards?: Record<string, readonly (CardInstanceId | string)[]>;
  /** Per-player lore totals. */
  lore?: Partial<Record<PlayerId, number>>;
};

/**
 * Build a minimal `PlayCardExecutionContext` suitable for unit-testing effect
 * resolvers, target resolvers, and condition evaluators in isolation.
 *
 * Zone key format: `"<zone>:<playerId>"`, e.g. `"play:player-one"`. The owner
 * is inferred from the segment after the colon.
 *
 * This harness is intentionally small. For full gameplay coverage use
 * `LorcanaMultiplayerTestEngine` instead — simulator integration tests live
 * under `packages/lorcana/lorcana-simulator/src/testing/**`.
 */
export function createTestContext(args: CreateTestContextArgs = {}): PlayCardExecutionContext {
  const definitions = args.definitions ?? {};
  const cardMeta = args.cardMeta ?? {};
  const zoneCards: Record<string, CardInstanceId[]> = Object.fromEntries(
    Object.entries(args.zoneCards ?? {}).map(([key, cards]) => [
      key,
      [...cards] as CardInstanceId[],
    ]),
  );
  const cardIndex: Record<string, { ownerID: PlayerId; controllerID: PlayerId; zoneKey: string }> =
    {};

  for (const [key, cards] of Object.entries(zoneCards)) {
    const [, ownerSegment] = key.split(":");
    const ownerId = (ownerSegment ?? PLAYER_ONE) as PlayerId;
    for (const cardId of cards) {
      cardIndex[cardId] = { ownerID: ownerId, controllerID: ownerId, zoneKey: key };
    }
  }

  const currentPlayer = args.currentPlayer ?? PLAYER_ONE;
  const playerId = args.playerId ?? currentPlayer;

  const zonesApi = {
    getCards: ({ zone, playerId: p }: { zone: string; playerId: PlayerId }): CardInstanceId[] => [
      ...(zoneCards[`${zone}:${p}`] ?? []),
    ],
    getCardOwner: (cardId: CardInstanceId | string) => cardIndex[String(cardId)]?.ownerID,
    getCardController: (cardId: CardInstanceId | string) => cardIndex[String(cardId)]?.controllerID,
    getCardZone: (cardId: CardInstanceId | string) => cardIndex[String(cardId)]?.zoneKey,
    moveCard: (
      cardId: CardInstanceId | string,
      destination: { zone: string; playerId?: PlayerId },
    ) => {
      const entry = cardIndex[String(cardId)];
      if (!entry) {
        return;
      }
      const fromZone = entry.zoneKey;
      const toOwner = destination.playerId ?? entry.ownerID;
      const toZone = `${destination.zone}:${toOwner}`;
      zoneCards[fromZone] = (zoneCards[fromZone] ?? []).filter(
        (id) => String(id) !== String(cardId),
      );
      zoneCards[toZone] = [...(zoneCards[toZone] ?? []), cardId as CardInstanceId];
      entry.zoneKey = toZone;
      entry.controllerID = toOwner;
    },
    drawCards: ({
      from,
      to,
      count,
    }: {
      from: { zone: string; playerId: PlayerId };
      to: { zone: string; playerId: PlayerId };
      count: number;
    }): CardInstanceId[] => {
      const fromKey = `${from.zone}:${from.playerId}`;
      const toKey = `${to.zone}:${to.playerId}`;
      const available = zoneCards[fromKey] ?? [];
      const drawn = available.slice(0, count);
      zoneCards[fromKey] = available.slice(drawn.length);
      zoneCards[toKey] = [...(zoneCards[toKey] ?? []), ...drawn];
      for (const cardId of drawn) {
        const entry = cardIndex[String(cardId)];
        if (entry) {
          entry.zoneKey = toKey;
          entry.controllerID = to.playerId;
        }
      }
      return drawn;
    },
  };

  const cardsApi = {
    get: (cardId: CardInstanceId | string) => {
      const definition = definitions[String(cardId)];
      return {
        definition,
        meta: cardMeta[String(cardId)] ?? {},
        ownerID: cardIndex[String(cardId)]?.ownerID ?? PLAYER_ONE,
        controllerID: cardIndex[String(cardId)]?.controllerID ?? PLAYER_ONE,
        zoneID: cardIndex[String(cardId)]?.zoneKey,
        getStrength: () => Number(definition?.strength ?? 0),
        getWillpower: () => Number(definition?.willpower ?? 0),
      };
    },
    require: (cardId: CardInstanceId | string) => {
      const definition = definitions[String(cardId)];
      return {
        definition,
        meta: cardMeta[String(cardId)] ?? {},
        ownerID: cardIndex[String(cardId)]?.ownerID ?? PLAYER_ONE,
        controllerID: cardIndex[String(cardId)]?.controllerID ?? PLAYER_ONE,
        zoneID: cardIndex[String(cardId)]?.zoneKey,
        getStrength: () => Number(definition?.strength ?? 0),
        getWillpower: () => Number(definition?.willpower ?? 0),
      };
    },
    getDefinition: (cardId: CardInstanceId | string) => definitions[String(cardId)],
    getMeta: (cardId: CardInstanceId | string) => cardMeta[String(cardId)] ?? {},
    setMeta: (cardId: CardInstanceId | string, nextMeta: Record<string, unknown>) => {
      cardMeta[String(cardId)] = { ...nextMeta };
    },
    patchMeta: (cardId: CardInstanceId | string, nextMeta: Record<string, unknown>) => {
      cardMeta[String(cardId)] = { ...cardMeta[String(cardId)], ...nextMeta };
    },
    clearMeta: (cardId: CardInstanceId | string) => {
      delete cardMeta[String(cardId)];
    },
    entriesMeta: () => Object.entries(cardMeta),
  };

  const loreTotals: Record<PlayerId, number> = {
    [PLAYER_ONE]: args.lore?.[PLAYER_ONE] ?? 0,
    [PLAYER_TWO]: args.lore?.[PLAYER_TWO] ?? 0,
  } as Record<PlayerId, number>;

  return {
    G: {
      lore: loreTotals,
      pendingEffects: [],
      turnsCompletedByPlayer: {
        [PLAYER_ONE]: 0,
        [PLAYER_TWO]: 0,
      },
      turnMetadata: {
        cardsPlayedThisTurn: [],
        charactersQuesting: [],
        inkedThisTurn: [],
        shiftPlayedThisTurn: [],
        challengesByPlayerThisTurn: {},
        damagedCharactersByOwnerThisTurn: {},
        damageRemovedByPlayerThisTurn: {},
        banishedCharactersThisTurn: [],
        discardCardsLeftThisTurn: 0,
        cardsPutIntoDiscardThisTurnByOwner: {},
      },
    },
    playerId,
    cards: cardsApi,
    framework: {
      cards: cardsApi,
      events: { emit: () => undefined },
      state: {
        priority: { holder: currentPlayer },
        status: { turn: args.turn ?? 1, otp: args.otp },
        _zonesPrivate: {
          cardIndex,
          zoneCards,
          cardMeta,
        },
        playerIds: [PLAYER_ONE, PLAYER_TWO],
        turn: args.turn ?? 1,
        currentPlayer,
        phase: undefined,
        step: undefined,
        gameSegment: undefined,
        stateID: 0,
        matchID: "test-match",
        gameID: "test-game",
        gameEnded: false,
      },
      time: { getRemainingTime: () => 0 },
      zones: zonesApi,
    },
  } as unknown as PlayCardExecutionContext;
}
