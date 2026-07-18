import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09GumGumLightning077,
  op09Yasopp013,
  op14eb04Kaido030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-077 Gum-Gum Lightning", () => {
  test("Main returns two chosen DON!! and K.O.s the 6000-power boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09GumGumLightning077], activeDon: 3, restedDon: 1 },
      { character: [op09Yasopp013, op14eb04Kaido030] },
    );
    const boundaryId = engine.findCardInZone("north", "character", op09Yasopp013);
    const excludedId = engine.findCardInZone("north", "character", op14eb04Kaido030);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op09GumGumLightning077);
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "south",
    );

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected the cost-paid K.O. target choice.");
    }
    expect(step.candidates.map((candidate) => candidate.ref.id)).toContain(boundaryId);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      boundaryId,
    );
    expect(engine.getView("south").players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger adds one optional active DON!! without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op09GumGumLightning077], donDeckCount: 1 },
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
