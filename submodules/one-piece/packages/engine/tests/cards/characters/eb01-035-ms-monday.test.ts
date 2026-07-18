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
});
