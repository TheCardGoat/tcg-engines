import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  eb01Doma005,
  op01Crocodile067,
  op02Sakazuki099,
  op05Bellamy035,
  op05Sabo001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-001 Sabo", () => {
  test("replaces a battle K.O. of a 5000-power Character with the printed power loss", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op01Crocodile067, playedOnTurn: 0 }] },
      {
        leaderCardId: op05Sabo001,
        character: [{ card: op05Bellamy035, rested: true, playedOnTurn: 0 }],
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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("offers the same replacement when an opposing effect would K.O. the Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Sakazuki099, eb01Doma005], activeDon: 6 },
      {
        leaderCardId: op05Sabo001,
        character: [{ card: op05Bellamy035, rested: true }],
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
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
