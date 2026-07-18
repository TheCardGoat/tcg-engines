import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Pacifista075,
  op03Nami040,
  op06Shuraiya009,
  op06Zeff048,
  op10Bellamy077,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../src/index.ts";

describe("On Block review regressions", () => {
  test("Bellamy rests 2 DON!! before adding 1 active DON!! from its DON!! deck", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [op10Bellamy077],
        activeDon: 2,
        donDeckCount: 8,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bellamyId = engine.findCardInZone("north", "character", op10Bellamy077);
    const before = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [bellamyId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(before.activeDon - 1);
    expect(view.players.north.restedDon).toBe(before.restedDon + 2);
    expect(view.players.north.donDeckCount).toBe(before.donDeckCount - 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("Bellamy may decline without resting or adding DON!!", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [op10Bellamy077],
        activeDon: 2,
        donDeckCount: 8,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bellamyId = engine.findCardInZone("north", "character", op10Bellamy077);
    const before = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [bellamyId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(before.activeDon);
    expect(view.players.north.restedDon).toBe(before.restedDon);
    expect(view.players.north.donDeckCount).toBe(before.donDeckCount);
    expect(view.prompts).toHaveLength(0);
  });

  test("Zeff may trash 4 cards only with an East Blue Leader when the opponent blocks", () => {
    const deck = [
      eb01Doma005,
      eb01Blueno017,
      eb01Fourtricks025,
      eb01MountainGod018,
      op01Pacifista075,
      op10Bellamy077,
    ];
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Nami040,
        character: [op06Zeff048, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck,
      },
      { character: [op01Pacifista075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 4);
    expect(view.players.south.trash).toHaveLength(4);
    expect(view.prompts).toHaveLength(0);
  });

  test("Zeff does not trigger with a non-East Blue Leader", () => {
    const deck = [
      eb01Doma005,
      eb01Blueno017,
      eb01Fourtricks025,
      eb01MountainGod018,
      op01Pacifista075,
      op10Bellamy077,
    ];
    const engine = OnePieceTestEngine.create(
      {
        character: [op06Zeff048, { card: eb01MountainGod018, playedOnTurn: 0 }],
        deck,
      },
      { character: [op01Pacifista075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const blockerId = engine.findCardInZone("north", "character", op01Pacifista075);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("Shuraiya copies the opposing Leader's base power before the Counter Step on block", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        character: [op06Shuraiya009],
        hand: [eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const shuraiyaId = engine.findCardInZone("north", "character", op06Shuraiya009);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleBlocker", { selectedIds: [shuraiyaId] }, "north");

    expect(engine.pendingDecision("battleCounter", "north").actorId).toBe("north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === shuraiyaId)?.power,
    ).toBe(5000);
    expect(engine.getView("north").prompts.some((prompt) => prompt.kind === "judge")).toBe(false);
  });

  test("Shuraiya copies base power when attacking until the start of its next turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op06Shuraiya009, playedOnTurn: 0 }] },
      { character: [op01Pacifista075] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shuraiyaId = engine.findCardInZone("south", "character", op06Shuraiya009);

    engine.declareAttack(shuraiyaId, engine.leader("north"), "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === shuraiyaId)?.power,
    ).toBe(5000);
    engine.resolveDecision("battleBlocker", { selectedIds: ["skip"] }, "north");

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === shuraiyaId)?.power,
    ).toBe(5000);
    engine.endTurn("north");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === shuraiyaId)?.power,
    ).toBe(4000);
  });
});
