import { describe, expect, it } from "bun:test";
import type { CardInstanceId, LogMessage, PlayerId } from "#core";
import type { MatchState, PublishedGameEvent } from "./types";
import type { ProjectedLogEntry } from "./match-runtime.types";
import { projectGameLog } from "./match-runtime.logs";
import { createLorcanaGameLogEntry } from "../../types/log-messages";

const state = {} as MatchState;
const playerOneId = "player_one" as PlayerId;
const playerTwoId = "player_two" as PlayerId;
const threeArrowsId = "three-arrows" as CardInstanceId;
const princeEricId = "prince-eric" as CardInstanceId;
const hiddenInkId = "hidden-ink" as CardInstanceId;
const characterId = "character" as CardInstanceId;
const cardAId = "card-a" as CardInstanceId;
const cardBId = "card-b" as CardInstanceId;

function publishedGameEvent(seq: number, event: PublishedGameEvent["event"]): PublishedGameEvent {
  return {
    seq,
    timestamp: 1000 + seq,
    stateId: 1,
    event,
  };
}

function resolveBagLogEntry(): ProjectedLogEntry {
  return {
    category: "action",
    visibility: { mode: "PUBLIC" },
    typedEntry: createLorcanaGameLogEntry(
      "lorcana.bag.resolve.completed",
      {
        playerId: playerOneId,
        sourceId: threeArrowsId,
      },
      { mode: "PUBLIC" },
      "action",
    ),
  };
}

describe("projectGameLog", () => {
  it("adds Lorcana effect damage domain events to move outcomes", () => {
    const moveLogEntries: ProjectedLogEntry[] = [
      {
        category: "action",
        visibility: { mode: "PUBLIC" },
        typedEntry: createLorcanaGameLogEntry(
          "lorcana.effect.resolve.optionalSelection.accepted",
          {
            playerId: playerOneId,
            sourceCardId: threeArrowsId,
          },
          { mode: "PUBLIC" },
          "action",
        ),
      },
    ];

    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries,
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveEffect",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
        publishedGameEvent(2, {
          kind: "CUSTOM",
          customType: "damageDealt",
          data: {
            sourceId: threeArrowsId,
            targetId: princeEricId,
            amount: 2,
            newDamage: 2,
            damageType: "effect",
          },
        }),
      ],
    });

    expect(moveLogs).toEqual([
      {
        moveType: "resolveEffect",
        playerId: playerOneId,
        timestamp: 1001,
        public: [
          {
            key: "lorcana.effect.resolve.optionalSelection.accepted",
            values: { playerId: playerOneId, sourceCardId: threeArrowsId },
          },
          {
            key: "lorcana.outcome.effectDamage",
            values: {
              playerId: playerOneId,
              sourceId: threeArrowsId,
              targetId: princeEricId,
              amount: 2,
            },
          },
        ],
      },
    ]);
  });

  it("stores draw detail as a private appendix for the drawing player", () => {
    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries: [
        {
          category: "action",
          visibility: { mode: "PUBLIC" },
          typedEntry: createLorcanaGameLogEntry(
            "lorcana.effect.resolve.optionalSelection.accepted",
            {
              playerId: playerOneId,
              sourceCardId: threeArrowsId,
            },
            { mode: "PUBLIC" },
            "action",
          ),
        },
      ],
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveEffect",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
        publishedGameEvent(2, {
          kind: "CUSTOM",
          customType: "cardsDrawn",
          data: {
            playerId: playerOneId,
            amount: 2,
            cardIds: [cardAId, cardBId],
          },
        }),
      ],
    });

    expect(moveLogs[0]).toMatchObject({
      moveType: "resolveEffect",
      public: [
        { key: "lorcana.effect.resolve.optionalSelection.accepted" },
        {
          key: "lorcana.outcome.cardsDrawn",
          values: { playerId: playerOneId, amount: 2 },
        },
      ],
      privateByPlayerId: {
        [playerOneId]: [
          {
            key: "lorcana.private.cardsDrawn.detail",
            values: { playerId: playerOneId, cardIds: [cardAId, cardBId] },
          },
        ],
      },
    });
    expect(moveLogs[0]?.privateByPlayerId?.[playerTwoId]).toBeUndefined();
  });

  it("keeps card draw outcomes separated by drawing player", () => {
    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries: [
        {
          category: "action",
          visibility: { mode: "PUBLIC" },
          typedEntry: createLorcanaGameLogEntry(
            "lorcana.effect.resolve.optionalSelection.accepted",
            {
              playerId: playerOneId,
              sourceCardId: threeArrowsId,
            },
            { mode: "PUBLIC" },
            "action",
          ),
        },
      ],
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveEffect",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
        publishedGameEvent(2, {
          kind: "CUSTOM",
          customType: "cardsDrawn",
          data: {
            playerId: playerOneId,
            amount: 1,
            cardIds: [cardAId],
          },
        }),
        publishedGameEvent(3, {
          kind: "CUSTOM",
          customType: "cardsDrawn",
          data: {
            playerId: playerTwoId,
            amount: 1,
            cardIds: [cardBId],
          },
        }),
      ],
    });

    expect(moveLogs[0]?.public).toContainEqual({
      key: "lorcana.outcome.cardsDrawn",
      values: { playerId: playerOneId, amount: 1 },
    });
    expect(moveLogs[0]?.public).toContainEqual({
      key: "lorcana.outcome.cardsDrawn",
      values: { playerId: playerTwoId, amount: 1 },
    });
    expect(moveLogs[0]?.privateByPlayerId?.[playerOneId]).toContainEqual({
      key: "lorcana.private.cardsDrawn.detail",
      values: { playerId: playerOneId, cardIds: [cardAId] },
    });
    expect(moveLogs[0]?.privateByPlayerId?.[playerTwoId]).toContainEqual({
      key: "lorcana.private.cardsDrawn.detail",
      values: { playerId: playerTwoId, cardIds: [cardBId] },
    });
  });

  it("skips start-of-turn ready outcomes for inkwell cards", () => {
    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries: [resolveBagLogEntry()],
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveBag",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
        publishedGameEvent(2, {
          kind: "CUSTOM",
          customType: "cardReadied",
          data: { cardId: hiddenInkId, source: "start-of-turn", zone: "inkwell" },
        }),
        publishedGameEvent(3, {
          kind: "CUSTOM",
          customType: "cardInked",
          data: {
            playerId: playerOneId,
            cardId: hiddenInkId,
            from: "deck",
            to: "inkwell",
            private: true,
          },
        }),
      ],
    });

    expect(moveLogs[0]).toMatchObject({
      moveType: "resolveBag",
      public: [{ key: "lorcana.bag.resolve.completed" }],
      privateByPlayerId: {
        [playerOneId]: [
          {
            key: "lorcana.outcome.cardInkedExerted",
            values: { playerId: playerOneId, cardId: hiddenInkId },
          },
        ],
      },
    });
    const resolveBagLog = moveLogs[0];
    if (resolveBagLog?.moveType !== "resolveBag") {
      throw new Error("Expected a resolveBag log");
    }
    expect(
      resolveBagLog.public.some((message) => message.key === "lorcana.outcome.cardReadied"),
    ).toBe(false);
  });

  it("keeps start-of-turn ready outcomes for cards in play", () => {
    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries: [resolveBagLogEntry()],
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveBag",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
        publishedGameEvent(2, {
          kind: "CUSTOM",
          customType: "cardReadied",
          data: { cardId: characterId, source: "start-of-turn", zone: "play" },
        }),
      ],
    });

    const resolveBagLog = moveLogs[0];
    if (resolveBagLog?.moveType !== "resolveBag") {
      throw new Error("Expected a resolveBag log");
    }
    expect(resolveBagLog.public).toContainEqual({
      key: "lorcana.outcome.cardReadied",
      values: { playerId: playerOneId, cardId: characterId },
    });
  });

  it("keeps scry detail private while leaving revealed destinations public", () => {
    const destinations = [
      { zone: "deck-top", cardIds: [cardAId] },
      { zone: "hand", cardIds: [cardBId], revealed: true },
    ];
    const privateScryMessage = {
      key: "lorcana.effect.resolve.scrySelection.detail",
      values: {
        playerId: playerOneId,
        sourceCardId: threeArrowsId,
        selection: [],
        destinations,
      },
    } as unknown as LogMessage;
    const { moveLogs } = projectGameLog({
      state,
      moveLogEntries: [
        {
          category: "action",
          visibility: {
            mode: "PUBLIC_WITH_OVERRIDES",
            overrides: { [playerOneId]: privateScryMessage },
          },
          typedEntry: createLorcanaGameLogEntry(
            "lorcana.effect.resolve.scrySelection",
            {
              playerId: playerOneId,
              sourceCardId: threeArrowsId,
            },
            {
              mode: "PUBLIC_WITH_OVERRIDES",
              overrides: { [playerOneId]: privateScryMessage },
            },
            "action",
          ),
        },
      ],
      publishedGameEvents: [
        publishedGameEvent(1, {
          kind: "MOVE_EXECUTED",
          commandId: "command-1",
          move: "resolveEffect",
          playerId: playerOneId,
          inputRedacted: false,
          input: {},
        }),
      ],
    });

    expect(moveLogs[0]).toMatchObject({
      moveType: "resolveEffect",
      public: [
        {
          key: "lorcana.effect.resolve.scrySelection.detail",
          values: {
            playerId: playerOneId,
            sourceCardId: threeArrowsId,
            selection: [],
            destinations: [{ zone: "hand", cardIds: [cardBId], revealed: true }],
          },
        },
      ],
      privateByPlayerId: {
        [playerOneId]: [
          {
            key: "lorcana.private.effect.resolve.scrySelection.detail",
            values: {
              playerId: playerOneId,
              sourceCardId: threeArrowsId,
              selection: [],
              destinations,
            },
          },
        ],
      },
    });
  });
});
