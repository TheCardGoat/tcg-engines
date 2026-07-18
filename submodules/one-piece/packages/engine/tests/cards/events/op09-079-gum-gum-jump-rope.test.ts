import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09GumGumJumpRope079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-079 Gum-Gum Jump Rope", () => {
  test("Main returns two chosen DON!!, rests the cost-5 boundary, then draws", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09GumGumJumpRope079],
        deck: [eb01Doma005],
        activeDon: 3,
        restedDon: 1,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const drawId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op09GumGumJumpRope079);
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(drawId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds one optional active DON!! without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09GumGumJumpRope079], donDeckCount: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({
      activeDon: 1,
      donDeckCount: 0,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
