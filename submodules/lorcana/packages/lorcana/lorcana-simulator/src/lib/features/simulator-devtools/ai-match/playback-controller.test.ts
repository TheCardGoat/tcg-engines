import { afterEach, describe, expect, it } from "bun:test";
import {
  DECK_AWARE_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  createPlayerId,
  type AcceptedMoveRecord,
  type CardInstanceId,
  type EngineLogRecord,
} from "@tcg/lorcana-engine";
import { steelSapphireMidrange } from "../deck-fixtures/index.js";
import {
  AutomatedMatchPlaybackController,
  createPersistedMoveLogEntries,
} from "./playback-controller.js";

const PLAYER_ONE_ID = createPlayerId("player_one");
const PLAYER_TWO_ID = createPlayerId("player_two");
const CARD_ONE_ID = "card-1" as CardInstanceId;

describe("AutomatedMatchPlaybackController strategy loading", () => {
  let controller: AutomatedMatchPlaybackController | null = null;

  afterEach(() => {
    controller?.dispose();
    controller = null;
  });

  it("upgrades supported deck colors to the matching deck-aware strategy at game start", async () => {
    controller = await AutomatedMatchPlaybackController.create({
      playerOneDeckText: steelSapphireMidrange.cards,
      playerTwoDeckText: steelSapphireMidrange.cards,
      playerOneStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      playerTwoStrategyId: DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
      seed: "playback-controller:deck-aware-loader-supported",
    });

    expect(controller.getConfig().playerOneStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
    expect(controller.getConfig().playerTwoStrategyId).toBe(DEFAULT_AUTOMATED_ACTION_STRATEGY_ID);
    expect(controller.getResolvedStrategyOption(PLAYER_ONE_ID)?.id).toBe(
      DECK_AWARE_LORE_RACE_STRATEGY_ID,
    );
    expect(controller.getResolvedStrategyOption(PLAYER_TWO_ID)?.id).toBe(
      DECK_AWARE_LORE_RACE_STRATEGY_ID,
    );
  });
});

describe("createPersistedMoveLogEntries", () => {
  it("preserves typed log entries for restored player history", () => {
    const acceptedMoves: AcceptedMoveRecord[] = [
      {
        actorId: "player_one",
        gameId: "game-1",
        input: { args: { playerId: "player_one", cardId: "card-1" } },
        moveId: "playCard",
        processedCommand: {
          commandID: "cmd-1",
          input: { args: { playerId: "player_one", cardId: "card-1" } },
          move: "playCard",
        },
        sourceAuthority: "client",
        stateVersion: 5,
        timestamp: 123,
        turnNumber: 2,
      },
    ];
    const engineLogs: EngineLogRecord[] = [
      {
        gameId: "game-1",
        stateVersion: 5,
        timestamp: 123,
        sourceAuthority: "client",
        log: {
          moveType: "playCard",
          playerId: PLAYER_ONE_ID,
          timestamp: 123,
          public: [
            {
              key: "lorcana.move.playCard",
              values: { playerId: PLAYER_ONE_ID, cardId: CARD_ONE_ID },
            },
          ],
        },
      },
    ];

    const entries = createPersistedMoveLogEntries({
      acceptedMoves,
      engineLogs,
      resolveActorSide: (actorId) => (actorId === "player_one" ? "playerOne" : undefined),
    });

    expect(entries).toHaveLength(1);
    expect(entries[0]?.typedLogEntry).toMatchObject({
      moveType: "playCard",
      public: [
        {
          key: "lorcana.move.playCard",
          values: { cardId: CARD_ONE_ID },
        },
      ],
    });
    expect(entries[0]?.title).not.toBe("playCard");
  });

  it("matches each move to its own log when a batch has multiple moves at different stateVersions", () => {
    // Regression: previously all logs in a push batch got stateVersion = latestStateVersion,
    // causing the first log (e.g. bot's playCard) to be matched to the last accepted move
    // (the human's playCard), displaying the wrong card name in the game log.
    const CARD_BOT_ID = "card-bot" as CardInstanceId;
    const CARD_HUMAN_ID = "card-human" as CardInstanceId;

    const acceptedMoves: AcceptedMoveRecord[] = [
      {
        actorId: "bot_player",
        gameId: "game-1",
        input: { args: { playerId: "player_two", cardId: CARD_BOT_ID } },
        moveId: "playCard",
        processedCommand: { commandID: "cmd-1", move: "playCard" },
        sourceAuthority: "client",
        stateVersion: 1,
        timestamp: 100,
        turnNumber: 1,
      },
      {
        actorId: "human_player",
        gameId: "game-1",
        input: { args: { playerId: "player_one", cardId: CARD_HUMAN_ID } },
        moveId: "playCard",
        processedCommand: { commandID: "cmd-2", move: "playCard" },
        sourceAuthority: "client",
        stateVersion: 2,
        timestamp: 200,
        turnNumber: 1,
      },
    ];

    const engineLogs: EngineLogRecord[] = [
      {
        gameId: "game-1",
        stateVersion: 1,
        timestamp: 100,
        sourceAuthority: "client",
        log: {
          moveType: "playCard",
          playerId: PLAYER_TWO_ID,
          timestamp: 100,
          public: [
            {
              key: "lorcana.move.playCard",
              values: { playerId: PLAYER_TWO_ID, cardId: CARD_BOT_ID },
            },
          ],
        },
      },
      {
        gameId: "game-1",
        stateVersion: 2,
        timestamp: 200,
        sourceAuthority: "client",
        log: {
          moveType: "playCard",
          playerId: PLAYER_ONE_ID,
          timestamp: 200,
          public: [
            {
              key: "lorcana.move.playCard",
              values: { playerId: PLAYER_ONE_ID, cardId: CARD_HUMAN_ID },
            },
          ],
        },
      },
    ];

    const entries = createPersistedMoveLogEntries({
      acceptedMoves,
      engineLogs,
      resolveActorSide: (actorId) =>
        actorId === "human_player"
          ? "playerOne"
          : actorId === "bot_player"
            ? "playerTwo"
            : undefined,
    });

    expect(entries).toHaveLength(2);
    // Bot's move must show the bot's card, not the human's
    expect(entries[0]?.typedLogEntry).toMatchObject({
      moveType: "playCard",
      public: [
        {
          key: "lorcana.move.playCard",
          values: { cardId: CARD_BOT_ID },
        },
      ],
    });
    // Human's move must show the human's card
    expect(entries[1]?.typedLogEntry).toMatchObject({
      moveType: "playCard",
      public: [
        {
          key: "lorcana.move.playCard",
          values: { cardId: CARD_HUMAN_ID },
        },
      ],
    });
  });
});
