import { describe, expect, it } from "bun:test";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import { m } from "$lib/i18n/messages.js";
import type {
  MoveLogEntrySnapshot,
  SimulatorSerializedObject,
} from "@/features/simulator/model/contracts.js";
import {
  createCardSnapshot,
  createLogEntry,
} from "@/features/simulator-devtools/test-data/factories.js";
import { buildPostGameSummary, buildPostGameSummaryFromCanonical } from "./summary.js";

function createBoard(): LorcanaProjectedBoardView {
  return {
    gameID: "game-1",
    matchID: "match-1",
    stateID: 12,
    playerOrder: ["player_one", "player_two"],
    turnPlayer: "player_two",
    priorityPlayer: "player_two",
    turnNumber: 6,
    pendingMulligan: [],
    status: "finished",
    winner: "player_two",
    reason: "Player One conceded the game.",
    timerView: {
      state: "stopped",
      players: {},
    },
    players: {
      player_one: {
        lore: 7,
        hand: ["hand-1", "hand-2", "hand-3"],
        play: ["card-ariel", "card-location"],
        inkwell: ["ink-1", "ink-2", "ink-3", "ink-4"],
        discard: ["discard-1"],
        deckCount: 42,
        handCount: 3,
      },
      player_two: {
        lore: 12,
        hand: ["opp-hand-1", "opp-hand-2"],
        play: ["card-mickey"],
        inkwell: ["opp-ink-1", "opp-ink-2", "opp-ink-3"],
        discard: ["opp-discard-1", "opp-discard-2"],
        deckCount: 39,
        handCount: 2,
      },
    },
    cards: {
      "card-ariel": {
        ownerId: "player_one",
        zone: "play",
        fullName: "Ariel - On Human Legs",
        cardType: "character",
        exerted: false,
        lore: 2,
        hidden: false,
      },
      "card-location": {
        ownerId: "player_one",
        zone: "play",
        fullName: "Motunui - Island Paradise",
        cardType: "location",
        exerted: true,
        lore: 0,
        hidden: false,
      },
      "card-mickey": {
        ownerId: "player_two",
        zone: "play",
        fullName: "Mickey Mouse - Detective",
        cardType: "character",
        exerted: true,
        lore: 1,
        hidden: false,
      },
      "ink-1": { hidden: false, exerted: false },
      "ink-2": { hidden: false, exerted: false },
      "ink-3": { hidden: false, exerted: true },
      "ink-4": { hidden: false, exerted: true },
      "opp-ink-1": { hidden: false, exerted: false },
      "opp-ink-2": { hidden: false, exerted: false },
      "opp-ink-3": { hidden: false, exerted: true },
    },
    activeEffects: [],
    pendingEffects: [],
    bagEffects: [],
  } as unknown as LorcanaProjectedBoardView;
}

function createTypedLogEntry(
  moveId: MoveLogEntrySnapshot["moveId"],
  key: string,
  values: SimulatorSerializedObject,
  options: Partial<MoveLogEntrySnapshot> = {},
): MoveLogEntrySnapshot {
  return createLogEntry(options.title ?? key, {
    moveId,
    actorSide: options.actorSide ?? "playerOne",
    turnNumber: options.turnNumber ?? 1,
    ...options,
    typedLogEntry: {
      type: key,
      values,
      visibility: { mode: "PUBLIC" },
      category: "action",
    } as import("@tcg/lorcana-engine").LorcanaGameLogEntry,
    playerId: options.actorSide === "playerTwo" ? "player_two" : "player_one",
    params: values,
  });
}

describe("buildPostGameSummary", () => {
  it("parses the full log into counters, highlights, spotlights, and timeline turns", () => {
    const ariel = createCardSnapshot("playerOne", "play", {
      id: "card-ariel",
      name: "Ariel - On Human Legs",
      loreValue: 2,
      readyState: "ready",
    });
    const mickey = createCardSnapshot("playerTwo", "play", {
      id: "card-mickey",
      name: "Mickey Mouse - Detective",
      loreValue: 1,
      readyState: "exerted",
    });
    const motunui = createCardSnapshot("playerOne", "play", {
      id: "card-location",
      name: "Motunui - Island Paradise",
      type: "location",
      loreValue: 0,
      readyState: "exerted",
    });

    const entries: MoveLogEntrySnapshot[] = [
      createTypedLogEntry(
        "chooseWhoGoesFirst",
        "lorcana.setup.firstPlayerChosen",
        {
          chooser: "player_one",
          chosen: "player_two",
        },
        { timestamp: 1_000 },
      ),
      createTypedLogEntry(
        "alterHand",
        "lorcana.setup.mulligan.count",
        {
          playerId: "player_one",
          count: 2,
        },
        { timestamp: 3_000 },
      ),
      createTypedLogEntry(
        "playCard",
        "lorcana.move.playCard",
        {
          playerId: "player_one",
          cardId: "card-ariel",
        },
        {
          turnNumber: 2,
          timestamp: 5_000,
        },
      ),
      createTypedLogEntry(
        "putCardIntoInkwell",
        "lorcana.card.inked",
        {
          playerId: "player_one",
          cardId: "card-ariel",
        },
        {
          turnNumber: 2,
          timestamp: 8_000,
        },
      ),
      createTypedLogEntry(
        "quest",
        "lorcana.move.quest",
        {
          playerId: "player_one",
          cardId: "card-ariel",
          loreGained: 2,
        },
        {
          turnNumber: 3,
          timestamp: 12_000,
        },
      ),
      createTypedLogEntry(
        "challenge",
        "lorcana.move.challenge",
        {
          playerId: "player_one",
          attackerId: "card-ariel",
          defenderId: "card-mickey",
        },
        {
          turnNumber: 4,
          timestamp: 15_000,
        },
      ),
      createTypedLogEntry(
        "moveCharacterToLocation",
        "lorcana.move.moveCharacterToLocation",
        {
          playerId: "player_one",
          characterId: "card-ariel",
          locationId: "card-location",
        },
        {
          turnNumber: 4,
          timestamp: 17_300,
        },
      ),
      createTypedLogEntry(
        "activateAbility",
        "lorcana.ability.activated.named",
        {
          playerId: "player_one",
          cardId: "card-ariel",
          abilityName: "Singer 5",
        },
        {
          turnNumber: 5,
          timestamp: 20_000,
        },
      ),
      createTypedLogEntry(
        "resolveEffect",
        "lorcana.effect.resolve.targetSelection",
        {
          playerId: "player_one",
          sourceCardId: "card-ariel",
          targets: ["card-mickey", "card-location"],
          abilityName: "Singer 5",
        },
        {
          turnNumber: 5,
          timestamp: 24_500,
        },
      ),
      createTypedLogEntry(
        "passTurn",
        "lorcana.move.passTurn",
        {
          playerId: "player_one",
        },
        {
          turnNumber: 6,
          timestamp: 28_000,
        },
      ),
      createTypedLogEntry(
        "concede",
        "lorcana.move.concede",
        {
          playerId: "player_one",
        },
        {
          turnNumber: 6,
          timestamp: 30_000,
        },
      ),
      createLogEntry("Judge note", {
        moveId: "passTurn",
        actorSide: "playerTwo",
        turnNumber: 6,
        timestamp: 31_500,
      }),
    ];

    const summary = buildPostGameSummary({
      board: createBoard(),
      entries,
      viewerSide: "playerOne",
    });

    expect(summary.totalLogEntries).toBe(entries.length);
    expect(summary.timeline).toHaveLength(entries.length);
    expect(summary.turns).toHaveLength(6);
    expect(summary.outcome.winnerSide).toBe("playerTwo");
    expect(summary.outcome.viewerResult).toBe("defeat");
    expect(summary.players.playerOne.availableInk).toBe(2);
    expect(summary.players.playerOne.readyCount).toBe(1);
    expect(summary.players.playerOne.exertedCount).toBe(1);

    expect(summary.countersBySide.playerOne.cardsPlayed).toBe(1);
    expect(summary.countersBySide.playerOne.inked).toBe(1);
    expect(summary.countersBySide.playerOne.quests).toBe(1);
    expect(summary.countersBySide.playerOne.challengeInitiations).toBe(1);
    expect(summary.countersBySide.playerOne.movesToLocations).toBe(1);
    expect(summary.countersBySide.playerOne.abilityActivations).toBe(1);
    expect(summary.countersBySide.playerOne.effectResolutions).toBe(1);
    expect(summary.countersBySide.playerOne.passes).toBe(1);
    expect(summary.countersBySide.playerOne.concedes).toBe(1);

    expect(summary.topLoreContributors[0]?.label).toBe("Ariel - On Human Legs");
    expect(summary.topLoreContributors[0]?.value).toBe(2);
    expect(summary.mostPlayedCards[0]?.label).toBe("Ariel - On Human Legs");
    expect(summary.mostInvolvedChallengeCards[0]?.label).toBe("Ariel - On Human Legs");
    expect(summary.mostTriggeredAbilities.some((spotlight) => spotlight.label === "Singer 5")).toBe(
      true,
    );

    expect(
      summary.highlights.some(
        (highlight) => highlight.title === m["sim.postGame.highlight.outcome.defeat.title"]({}),
      ),
    ).toBe(true);
    expect(
      summary.highlights.some(
        (highlight) => highlight.title === m["sim.postGame.highlight.concede.title"]({}),
      ),
    ).toBe(true);

    expect(summary.timeline[0]?.typedMessages).toHaveLength(1);
    expect(summary.timeline[0]?.typedMessages[0]?.text.length).toBeGreaterThan(0);
    expect(summary.timeline.at(-1)?.typedMessages).toHaveLength(0);
    expect(summary.timeline.at(-1)?.text.length).toBeGreaterThan(0);
    expect(summary.timeline[2]?.moveCategoryId).toBe("play-card");
    expect(summary.timeline[2]?.text).toContain("Ariel - On Human Legs");
    expect(summary.timeline[2]?.segments.some((segment) => segment.kind === "card")).toBe(true);
    expect(summary.turns[1]?.durationMs).toBe(3_000);
    expect(summary.turns[3]?.durationMs).toBe(2_300);
    expect(summary.turns[5]?.moveCount).toBe(3);
  });

  it("rebuilds the modal summary from canonical API payloads without raw move ids", () => {
    const board = {
      ...createBoard(),
      reason: null,
    };
    const summary = buildPostGameSummaryFromCanonical(
      {
        source: "redis",
        gameId: "game-1",
        matchId: "match-1",
        status: "completed",
        winnerId: "player_two",
        reason: "Reached 20 lore",
        createdAt: new Date(0).toISOString(),
        completedAt: new Date(30_000).toISOString(),
        durationMs: 30_000,
        authority: "client",
        matchType: "practice_vs_bot",
        players: [
          {
            id: "player_one",
            side: "playerOne",
            displayName: "You",
            username: null,
            mmr: null,
          },
          {
            id: "player_two",
            side: "playerTwo",
            displayName: "Bot",
            username: null,
            mmr: null,
          },
        ],
        board,
        acceptedMoves: [
          {
            gameId: "game-1",
            stateVersion: 1,
            turnNumber: 3,
            actorId: "player_one",
            moveId: "questWithAll",
            input: { args: {} },
            processedCommand: {
              commandID: "cmd-1",
              input: { args: {} },
              move: "questWithAll",
            },
            timestamp: 12_000,
            sourceAuthority: "client",
          },
          {
            gameId: "game-1",
            stateVersion: 2,
            turnNumber: 4,
            actorId: "player_two",
            moveId: "putCardIntoInkwell",
            input: { args: { cardId: "card-mickey" } },
            processedCommand: {
              commandID: "cmd-2",
              input: { args: { cardId: "card-mickey" } },
              move: "putCardIntoInkwell",
            },
            timestamp: 15_000,
            sourceAuthority: "client",
          },
        ],
        engineLogs: [],
      },
      "playerOne",
    );

    expect(summary.timeline).toHaveLength(2);
    expect(summary.timeline[0]?.text).toBe(m["sim.postGame.fallback.questWithAll"]({}));
    expect(summary.timeline[1]?.text).toBe(
      m["sim.postGame.fallback.inkCard.named"]({
        card: "Mickey Mouse - Detective",
      }),
    );
    expect(summary.highlights[0]?.detail).toBe("Reached 20 lore");
  });
});
