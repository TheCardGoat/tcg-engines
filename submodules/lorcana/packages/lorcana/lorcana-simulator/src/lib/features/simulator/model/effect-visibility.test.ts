import { describe, expect, it } from "bun:test";
import type { LorcanaProjectedBoardView, PlayerId } from "@tcg/lorcana-engine";
import {
  createPlayerId,
  createRecordCardCatalog,
  createRecordCardInstanceRegistry,
} from "@tcg/lorcana-engine";
import { createMockCharacter, createMockItem } from "@tcg/lorcana-engine/testing";
import { buildCardSnapshotMap } from "@/features/simulator/model/board-utils.js";
import { getPlayerSummary } from "@/features/simulator/model/derived-state.js";

function asPlayerId(value: string): PlayerId {
  return value as PlayerId;
}

function createBoard(): {
  board: LorcanaProjectedBoardView;
  playerOne: PlayerId;
  playerTwo: PlayerId;
} {
  const playerOne = createPlayerId("player_one");
  const playerTwo = createPlayerId("player_two");

  return {
    playerOne,
    playerTwo,
    board: {
      gameID: "game-1",
      matchID: "match-1",
      stateID: 1,
      gameSegment: "main",
      phase: "mainPhase",
      playerOrder: [playerOne, playerTwo],
      priorityPlayer: playerOne,
      turnPlayer: playerOne,
      turnNumber: 1,
      openingTurnPlayer: playerOne,
      pendingMulligan: [],
      choosingFirstPlayer: null,
      status: "playing",
      winner: null,
      reason: null,
      timerView: { serverTimestamp: 0, players: {} },
      bagEffects: [],
      pendingEffects: [],
      activeEffects: [],
      cards: {},
      players: {
        [playerOne]: {
          canAddCardToInkwell: false,
          lore: 5,
          deckCount: 40,
          handCount: 4,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
        [playerTwo]: {
          canAddCardToInkwell: false,
          lore: 3,
          deckCount: 40,
          handCount: 4,
          hand: [],
          play: [],
          inkwell: [],
          discard: [],
        },
      },
    },
  };
}

describe("effect visibility summaries", () => {
  it("builds card active effect summaries from projected active effects and static grants", () => {
    const { board, playerOne, playerTwo } = createBoard();
    const sourceDefinition = createMockCharacter({
      id: "source-definition",
      name: "Rhino",
      cost: 1,
      strength: 1,
      willpower: 2,
      lore: 1,
    });
    sourceDefinition.version = "One-Sixteenth Wolf";
    sourceDefinition.set = "008";
    sourceDefinition.cardNumber = 15;
    sourceDefinition.inkType = ["amber"];
    const targetDefinition = createMockCharacter({
      id: "target-definition",
      name: "Palace Guard",
      cost: 1,
      strength: 1,
      willpower: 4,
      lore: 1,
    });
    targetDefinition.version = "Spectral Sentry";
    targetDefinition.set = "008";
    targetDefinition.cardNumber = 45;
    targetDefinition.inkType = ["amethyst"];
    const staticResources = {
      zoneDefinitions: {},
      cards: createRecordCardCatalog("test-cards", {
        [sourceDefinition.id]: sourceDefinition,
        [targetDefinition.id]: targetDefinition,
      }),
      instances: createRecordCardInstanceRegistry("test-instances", {
        "source-card": {
          instanceId: "source-card",
          definitionId: sourceDefinition.id,
          ownerID: playerOne,
        },
        "target-card": {
          instanceId: "target-card",
          definitionId: targetDefinition.id,
          ownerID: playerTwo,
        },
      }),
    };

    board.cards = {
      "source-card": {
        id: "source-card",
        ownerId: playerOne,
        zone: "play",
        zoneIndex: 0,
        definitionId: sourceDefinition.id,
        fullName: "Rhino - One-Sixteenth Wolf",
        hidden: false,
        cardType: "character",
        strength: 1,
        willpower: 2,
        lore: 1,
        playCost: 1,
        moveCost: 0,
        damage: 0,
        exerted: false,
        drying: false,
        canBePutInInkwell: false,
        hasSupport: false,
        hasRush: false,
        hasReckless: false,
        hasEvasive: false,
        hasQuestRestriction: false,
        keywords: [],
        keywordValues: {},
        classifications: ["Dreamborn", "Ally"],
      },
      "target-card": {
        id: "target-card",
        ownerId: playerTwo,
        zone: "play",
        zoneIndex: 0,
        definitionId: targetDefinition.id,
        fullName: "Palace Guard - Spectral Sentry",
        hidden: false,
        cardType: "character",
        strength: 0,
        willpower: 4,
        lore: 1,
        playCost: 1,
        moveCost: 0,
        damage: 0,
        exerted: false,
        drying: false,
        canBePutInInkwell: false,
        hasSupport: false,
        hasRush: false,
        hasReckless: false,
        hasEvasive: false,
        hasQuestRestriction: false,
        keywords: ["Ward"],
        keywordValues: {},
        classifications: ["Dreamborn", "Ally", "Illusion"],
        keywordGrantSources: [
          {
            keyword: "Ward",
            sourceId: "source-card",
            sourceDefinitionId: sourceDefinition.id,
          },
        ],
      },
    };
    board.players[playerOne] = {
      ...board.players[playerOne],
      play: ["source-card"],
    };
    board.players[playerTwo] = {
      ...board.players[playerTwo],
      play: ["target-card"],
    };
    board.activeEffects = [
      {
        id: "ce_1",
        type: "stat-modifier",
        sourceId: "source-card",
        targetCardId: "target-card",
        startsAtTurn: 1,
        expiresAtTurn: 2,
        payload: {
          stat: "strength",
          modifier: -1,
          duration: "until-start-of-next-turn",
        },
      },
    ];

    const snapshots = buildCardSnapshotMap(board, staticResources);
    const targetSnapshot = snapshots["target-card"];

    expect(targetSnapshot?.activeEffects?.map((effect) => effect.label)).toEqual([
      "Strength -1",
      "Ward",
    ]);
    expect(targetSnapshot?.activeEffects?.[0]).toMatchObject({
      sourceCardId: "source-card",
      sourceLabel: "Rhino - One-Sixteenth Wolf",
      targetCardId: "target-card",
      amount: -1,
    });
  });

  it("builds player active effect summaries and source ids from projected player-targeted effects", () => {
    const { board, playerOne } = createBoard();
    const sourceDefinition = createMockItem({
      id: "support-definition",
      name: "Lucky Dime",
      cost: 2,
    });
    sourceDefinition.set = "006";
    sourceDefinition.cardNumber = 197;
    sourceDefinition.inkType = ["sapphire"];
    const staticResources = {
      zoneDefinitions: {},
      cards: createRecordCardCatalog("test-cards", {
        [sourceDefinition.id]: sourceDefinition,
      }),
      instances: createRecordCardInstanceRegistry("test-instances", {
        "support-card": {
          instanceId: "support-card",
          definitionId: sourceDefinition.id,
          ownerID: playerOne,
        },
      }),
    };

    board.cards = {
      "support-card": {
        id: "support-card",
        ownerId: playerOne,
        zone: "play",
        zoneIndex: 0,
        definitionId: sourceDefinition.id,
        fullName: "Lucky Dime",
        hidden: false,
        cardType: "item",
        playCost: 2,
        moveCost: 0,
        damage: 0,
        exerted: false,
        drying: false,
        canBePutInInkwell: false,
        hasSupport: false,
        hasRush: false,
        hasReckless: false,
        hasEvasive: false,
        hasQuestRestriction: false,
        keywords: [],
        keywordValues: {},
        classifications: [],
      },
    };
    board.players[playerOne] = {
      ...board.players[playerOne],
      play: ["support-card"],
    };
    board.activeEffects = [
      {
        id: "player-cost-1",
        type: "player-cost-reduction",
        sourceId: "support-card",
        targetPlayerId: playerOne,
        expiresAtTurn: 1,
        payload: {
          amount: 2,
          cardType: "character",
          duration: "next-play-this-turn",
        },
      },
    ];

    const cardSnapshotsById = buildCardSnapshotMap(board, staticResources);
    const playerSummary = getPlayerSummary("playerOne", board, cardSnapshotsById);

    expect(playerSummary?.activeEffects).toMatchObject([
      {
        label: "Cost -2",
        sourceCardId: "support-card",
        sourceLabel: "Lucky Dime",
      },
    ]);
    expect(playerSummary?.effectSourceCardIds).toEqual(["support-card"]);
  });
});
