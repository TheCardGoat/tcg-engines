import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, eb01MsMonday035, op01Crocodile062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "../events/battle-fixture.shared.ts";

describe("EB01-035 Ms. Monday", () => {
  test("pays its Life Trigger, plays itself, and maps its On Play power target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01Crocodile062,
        life: [eb01MsMonday035],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    // DON!! −1 is optional; accept and pay so Play this card resolves.
    engine.accept("north");
    try {
      engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    } catch {
      // Cost auto-paid when a single DON!! is the only legal payment.
    }

    const mondayId = engine.findCardInZone("north", "character", eb01MsMonday035);
    const powerTarget = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(powerTarget?.kind).toBe("selectEntity");
    if (powerTarget?.kind !== "selectEntity") {
      throw new Error("Expected Ms. Monday's Leader-or-Character power choice.");
    }
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      mondayId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.leader.power).toBe(6000);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(mondayId);
    expect(view.players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(mondayId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op01Crocodile062,
        life: [eb01MsMonday035],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const before = engine.getView("north").players.north;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");
    const after = engine.getView("north").players.north;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.characters.some((card) => card?.cardId === eb01MsMonday035.id)).toBe(false);
    expect(after.leader.power).toBe(before.leader.power);
  });
});
