import { describe, expect, test } from "vite-plus/test";
import { decodeTestSimulatorEnvelope } from "@tcg/engine-core/test-simulator";

import {
  createMatch,
  createSt01PlayerConfig,
  createTestMatchState,
  OnePieceTestEngine,
  SOUTH,
} from "../src/index.ts";
import {
  op13GumGumGatlingGun021,
  op13Higuma013,
  op13MonkeyDLuffy001,
  op13Otama043,
  op13RoronoaZoro037,
  op13WindmillVillage022,
  st01MonkeyDLuffy001,
} from "../../cards/src/index.ts";

describe("OnePieceTestEngine fixtures", () => {
  test("creates a fresh game with the official One Piece setup", () => {
    const state = createMatch({
      firstPlayer: SOUTH,
      shuffleDecks: false,
      openingHandSize: 5,
      skipFirstTurnDraw: true,
      maxCharacterSlots: 5,
      players: {
        south: createSt01PlayerConfig("South"),
        north: createSt01PlayerConfig("North"),
      },
    });

    const assertFreshPlayerSetup = (seat: "south" | "north") => {
      const player = state.players[seat];
      const leader = state.cards[player.leaderInstanceId]!;

      expect(player.stageArea).toBeNull();
      expect(player.trash).toEqual([]);
      expect(player.characterArea).toEqual([null, null, null, null, null]);
      expect(leader.zone).toBe("leader");
      expect(leader.faceUp).toBe(true);
      expect(leader.rested).toBe(false);
      expect(leader.attachedDon).toBe(0);
      expect(player.activeDon).toBe(0);
      expect(player.restedDon).toBe(0);
      expect(player.donDeckCount).toBe(10);
      expect(player.hand).toHaveLength(5);
      expect(player.life).toHaveLength(st01MonkeyDLuffy001.life);
    };

    assertFreshPlayerSetup("south");
    assertFreshPlayerSetup("north");
  });

  test("seeds deterministic zones and card state", () => {
    const state = createTestMatchState(
      {
        hand: [op13Otama043],
        deck: [op13GumGumGatlingGun021],
        life: 3,
        character: [{ card: op13Higuma013, rested: true, attachedDon: 2, playedOnTurn: 1 }],
        stage: op13WindmillVillage022,
        trash: [op13RoronoaZoro037],
        activeDon: 4,
        restedDon: 1,
      },
      { deck: 2 },
      { seed: "fixture-test" },
    );

    const playerOne = state.players.south;
    const characterId = playerOne.characterArea[0]!;

    expect(state.status).toBe("active");
    expect(state.phase).toBe("main");
    expect(playerOne.hand.map((id) => state.cards[id]?.cardId)).toEqual([op13Otama043.id]);
    expect(playerOne.deck.map((id) => state.cards[id]?.cardId)).toEqual([
      op13GumGumGatlingGun021.id,
    ]);
    expect(playerOne.life).toHaveLength(3);
    expect(state.cards[characterId]).toMatchObject({
      cardId: op13Higuma013.id,
      zone: "character",
      rested: true,
      attachedDon: 2,
      playedOnTurn: 1,
    });
    expect(state.cards[playerOne.stageArea!]?.cardId).toBe(op13WindmillVillage022.id);
    expect(playerOne.trash.map((id) => state.cards[id]?.cardId)).toEqual([op13RoronoaZoro037.id]);
    expect(playerOne.activeDon).toBe(4);
    expect(playerOne.restedDon).toBe(1);
  });

  test("accepts imported card definitions in fixture setup and wrapper lookups", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op13MonkeyDLuffy001,
      hand: [op13Otama043],
      character: [{ card: op13Higuma013, rested: true }],
      activeDon: 1,
      life: 3,
    });

    engine.playCard(op13Otama043);

    const played = engine.findCardInZone("south", "character", op13Otama043);
    expect(engine.getState().cards[played]?.cardId).toBe(op13Otama043.id);
  });

  test("drives accepted and rejected commands through the engine wrapper", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Otama043],
      activeDon: 1,
      life: 3,
    });

    engine.playCard(op13Otama043);

    const played = engine.findCardInZone("south", "character", op13Otama043);
    expect(engine.getState().cards[played]?.zone).toBe("character");
    expect(engine.getState().players.south.restedDon).toBe(1);

    const failure = engine.expectFailure({
      type: "attachDon",
      seat: "south",
      targetId: played,
      amount: 10,
    });
    expect(failure.reason).toBe("Not enough active DON!! to attach.");
  });

  test("opens simulator URLs with a default south viewer", () => {
    const engine = OnePieceTestEngine.create();
    const result = engine.openInSimulator({
      open: false,
      baseUrl: "http://localhost:5173",
    });

    const encoded = new URL(result.url).searchParams.get("state");
    expect(encoded).not.toBeNull();
    const envelope = decodeTestSimulatorEnvelope(encoded!);

    expect(result.transport).toBe("query");
    expect(envelope.gameSlug).toBe("one-piece");
    expect(envelope.viewer).toBe(SOUTH);
    expect(envelope.payload).toHaveProperty("state");
  });
});
