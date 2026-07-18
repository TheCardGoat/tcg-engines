import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MsWednesday034, op01Crocodile062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-034 Ms. Wednesday", () => {
  test("recycles attached DON!! into active DON!! before offering Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      {
        leaderCardId: op01Crocodile062,
        character: [eb01MsWednesday034],
        activeDon: 1,
        donDeckCount: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const wednesdayId = engine.findCardInZone("north", "character", eb01MsWednesday034);

    engine.attachDon(wednesdayId, 1, "north");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const addDon = engine.pendingDecision("effectAddDon", "north").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Ms. Wednesday's active DON!! count choice.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") {
      throw new Error("Expected Ms. Wednesday's Blocker choice.");
    }
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", wednesdayId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [wednesdayId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === wednesdayId)?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
