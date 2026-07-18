import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op07DraculeMihawk044,
  op09BartholomewKuma108,
  op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-096 There's No Longer Any Need for the Seven Warlords of the Sea!!!", () => {
  test("Main K.O.s the included Warlords trait at the cost-8 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096], activeDon: 4 },
      { character: [op07DraculeMihawk044, eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", op07DraculeMihawk044);

    engine.playCard(op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096);
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected the Warlords K.O. choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger uses the lower cost-4 Warlords boundary", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op09BartholomewKuma108] },
      { life: [op10ThereSNoLongerAnyNeedForTheSevenWarlordsOfTheSea096] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op09BartholomewKuma108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
