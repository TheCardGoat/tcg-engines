import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op13MeteorFist020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-020 Meteor Fist", () => {
  test("Life Trigger activates Main and gives an opposing Character -5000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13MeteorFist020],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = engine
      .getView("north")
      .players.south.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore == null) throw new Error("Expected the attacking Character's power.");

    engine.declareAttack(targetId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore - 5000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
