import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09Usopp024, op11BlueHole098 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-098 Blue Hole", () => {
  test("Main trashes exactly the top 3 deck cards before K.O.ing a cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op11BlueHole098],
        deck: [eb01Doma005, op09Usopp024, eb01MountainGod018],
        activeDon: 3,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const trashedDeckIds = engine.getState().players.south.deck.slice(0, 3);

    engine.playCard(op11BlueHole098);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const trashIds = engine.getView("south").players.south.trash.map((card) => card.instanceId);
    expect(trashIds).toEqual(expect.arrayContaining(trashedDeckIds));
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger gives the chosen Leader +1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op11BlueHole098] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.leader.power).toBe(6000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
