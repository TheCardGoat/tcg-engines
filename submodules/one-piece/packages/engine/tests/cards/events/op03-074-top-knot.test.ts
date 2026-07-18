import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Hajrudin018, op03TopKnot074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-074 Top Knot", () => {
  test("pays DON!! -1 and bottom-decks the opposing cost-4 boundary", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03TopKnot074],
        activeDon: 3,
      },
      {
        character: [op01Hajrudin018, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", op01Hajrudin018);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const ownerDeckBefore = engine.getView("north").players.north.deckCount;

    engine.playCard(op03TopKnot074);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing low-cost Character.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      false,
    );
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.players.north.deckCount).toBe(ownerDeckBefore + 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger skips Event payment but retains DON!! -1 before the return", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Hajrudin018, playedOnTurn: 0 },
        ],
      },
      {
        life: [op03TopKnot074],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("south", "character", op01Hajrudin018);
    const before = engine.getView("north").players.north;
    const ownerDeckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({
      activeDon: before.activeDon - 1,
      restedDon: before.restedDon,
      donDeckCount: before.donDeckCount + 1,
    });
    expect(engine.getView("south").players.south.deckCount).toBe(ownerDeckBefore + 1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
