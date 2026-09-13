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
  op10Scotch008,
  op13GumGumGatlingGun021,
  op13Higuma013,
  op13MonkeyDLuffy001,
  op13Otama043,
  op13RoronoaZoro037,
  op13WindmillVillage022,
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
      // 5-2-1-7: starting Life is placed after the mulligan step, when the
      // game starts — not at match creation.
      expect(player.life).toEqual([]);
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
      // Legacy fixture convention: playedOnTurn: 1 means "played this turn"
      // and is remapped to the active turnNumber (default 3).
      playedOnTurn: state.turnNumber,
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

  test("asSouth/asNorth drivers resolve catalog cards and preflight attack legality", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op13Higuma013, playedOnTurn: 0 }],
        hand: [op13Otama043],
        activeDon: 1,
      },
      { life: 4, deck: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.play(op13Otama043);
    expect(south.findOnField(op13Otama043)).toBeTruthy();

    south.attack(op13Higuma013, north.leader());
    // Complete Counter so damage (if any) or battle cleanup finishes.
    if (north.hasPendingChoice()) {
      north.chooseCounter();
    }

    expect(
      south.view().players.south.characters.find((card) => card?.cardId === op13Higuma013.id)
        ?.rested,
    ).toBe(true);
  });

  test("asSouth().attack throws a human-readable error when the attacker cannot attack", () => {
    const engine = OnePieceTestEngine.create(
      {
        // played this turn (default remaps playedOnTurn: 1 → current turn)
        character: [{ card: op13Higuma013, playedOnTurn: 1 }],
      },
      { life: 4, deck: 6 },
      { firstPlayer: "north", activeSeat: "south" },
    );

    expect(() => engine.asSouth().attack(op13Higuma013, engine.asNorth().leader())).toThrow(
      /asSouth\(\)\.attack[\s\S]*attacker cannot attack[\s\S]*(played this turn|canAttackWith=false)/,
    );
  });

  test("asSouth().play throws a human-readable error when the card is not in hand", () => {
    const engine = OnePieceTestEngine.create({ hand: [], activeDon: 1 });

    expect(() => engine.asSouth().play(op13Otama043)).toThrow(
      /asSouth\(\)\.play[\s\S]*not in south's hand/,
    );
  });

  test("asNorth().chooseBlocker resolves a pending Blocker step by catalog card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op13Higuma013, playedOnTurn: 0 }] },
      {
        character: [op10Scotch008],
        life: 4,
        deck: 6,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const south = engine.asSouth();
    const north = engine.asNorth();

    south.attack(op13Higuma013, north.leader());
    expect(north.pendingDecision("battleBlocker")).toBeTruthy();
    north.chooseBlocker(op10Scotch008);
    // Blocker step is consumed; battle may continue into Counter.
    expect(() => north.pendingDecision("battleBlocker")).toThrow(
      /no matching pending prompt|no pending/,
    );
    if (north.hasPendingChoice()) {
      north.chooseCounter();
    }
    expect(south.view().status).toBe("active");
  });

  test("named choose helpers throw a seat-prefixed error when no prompt is pending", () => {
    const engine = OnePieceTestEngine.create();

    expect(() => engine.asNorth().chooseBlocker()).toThrow(
      /asNorth\(\)\.choose[\s\S]*no pending battleBlocker/,
    );
  });
});
