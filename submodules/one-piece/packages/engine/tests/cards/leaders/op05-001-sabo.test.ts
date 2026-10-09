import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb01Doma005,
  op01Crocodile067,
  op02Sakazuki099,
  op05Bellamy035,
  op05Sabo001,
  op01Kaido094,
  op01King091,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-001 Sabo", () => {
  test("one replacement protects both qualifying Characters from a simultaneous Kaido K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op01King091, hand: [op01Kaido094], activeDon: 8 },
      {
        leaderCardId: op05Sabo001,
        character: [op05Bellamy035, op05Bellamy035, eb01Doma005],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "north" },
    );
    engine.attachDon(engine.leader("north"), 1, "north");
    engine.endTurn("north");
    engine.playCard(op01Kaido094, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
    const view = engine.getView("north");
    expect(view.players.north.characters.filter(Boolean).map((card) => card?.power)).toEqual([
      4000, 4000,
    ]);
    expect(view.players.north.trash.map((card) => card.cardId)).toContain(eb01Doma005.id);
    expect(view.prompts).toHaveLength(0);
  });

  test("replaces a battle K.O. of a 5000-power Character with the printed power loss", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Crocodile067, playedOnTurn: 0 }] },
      {
        leaderCardId: op05Sabo001,
        character: [{ card: op05Bellamy035, rested: true, playedOnTurn: 0 }, eb01Doma005],
        life: [eb01MountainGod018],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("north", "character", op05Bellamy035);

    engine.attachDon(engine.leader("north"), 1, "north");
    engine.endTurn("north");
    engine.declareAttack(
      engine.findCardInZone("south", "character", op01Crocodile067),
      targetId,
      "south",
    );
    engine.resolveDecision("battleKoReplacement", { optionId: "yes" }, "north");

    const target = engine
      .getView("north")
      .players.north.characters.find((card) => card?.instanceId === targetId);
    expect(target?.power).toBe(4000);
    expect(engine.getView("north").players.north.trash).toHaveLength(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.cardId === eb01Doma005.id)?.power,
    ).toBe(eb01Doma005.power);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("offers the same replacement when an opposing effect would K.O. the Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Sakazuki099, eb01Doma005], activeDon: 6 },
      {
        leaderCardId: op05Sabo001,
        character: [{ card: op05Bellamy035, rested: true }, eb01Doma005],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("north", "character", op05Bellamy035);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.attachDon(engine.leader("north"), 1, "north");
    engine.endTurn("north");

    engine.playCard(op02Sakazuki099, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");

    expect(engine.getView("north").players.north.characters[0]?.power).toBe(4000);
    expect(engine.getView("north").players.north.trash).toHaveLength(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.cardId === eb01Doma005.id)?.power,
    ).toBe(eb01Doma005.power);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
