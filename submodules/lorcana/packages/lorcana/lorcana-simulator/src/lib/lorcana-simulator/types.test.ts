import { describe, expect, it } from "bun:test";
import type { LorcanaProjectedBoardView, PlayerId } from "@tcg/lorcana-engine";
import {
  getAvailableInkForSide,
  getPlayerBoardForSide,
  getZoneCardIds,
} from "@/features/simulator/model/contracts.js";

function asPlayerId(value: string): PlayerId {
  return value as PlayerId;
}

function createBoard(): LorcanaProjectedBoardView {
  const playerOneId = asPlayerId("player-one");
  const playerTwoId = asPlayerId("player-two");

  return {
    activeEffects: [],
    bagEffects: [],
    cards: {
      "ink-ready": {
        damage: 0,
        definitionId: "ink-ready-definition",
        drying: false,
        exerted: false,
        fullName: "Ready Ink",
        hidden: false,
        id: "ink-ready",
        ownerId: playerOneId,
        zone: "inkwell",
      },
      "ink-spent": {
        damage: 0,
        definitionId: "ink-spent-definition",
        drying: false,
        exerted: true,
        fullName: "Spent Ink",
        hidden: false,
        id: "ink-spent",
        ownerId: playerOneId,
        zone: "inkwell",
      },
    },
    choosingFirstPlayer: null,
    gameID: "game-1",
    matchID: "match-1",
    openingTurnPlayer: null,
    pendingEffects: [],
    pendingMulligan: [],
    phase: "mainPhase",
    playerOrder: [playerOneId, playerTwoId],
    players: {
      [playerOneId]: {
        canAddCardToInkwell: false,
        deckCount: 10,
        discard: [],
        hand: [],
        handCount: 0,
        inkwell: ["ink-ready", "ink-spent"],
        lore: 0,
        play: [],
      },
      [playerTwoId]: {
        canAddCardToInkwell: false,
        deckCount: 10,
        discard: [],
        hand: [],
        handCount: 0,
        inkwell: [],
        lore: 0,
        play: [],
      },
    },
    priorityPlayer: playerOneId,
    reason: null,
    stateID: 1,
    status: "playing",
    step: null,
    timerView: { serverTimestamp: 0 },
    turnNumber: 1,
    turnPlayer: playerOneId,
    winner: null,
  };
}

describe("lorcana simulator board helpers", () => {
  it("derives inkwell data without recursive helper calls", () => {
    const board = createBoard();

    expect(getZoneCardIds(board, "playerOne", "inkwell")).toEqual(["ink-ready", "ink-spent"]);
    expect(getAvailableInkForSide(board, "playerOne")).toBe(1);
    expect(getPlayerBoardForSide(board, "playerOne")).toMatchObject({
      availableInk: 1,
      ownerId: "player-one",
      side: "playerOne",
    });
  });
});
