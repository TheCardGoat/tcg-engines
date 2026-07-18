import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op07Foxy071, op07MegatonNineTailsRush078 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-078 Megaton Nine-Tails Rush", () => {
  test("Main compares post-payment DON!! fields and reactivates a named Foxy Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07MegatonNineTailsRush078],
        character: [{ card: op07Foxy071, rested: true }],
        activeDon: 3,
      },
      { activeDon: 3 },
    );
    const foxyId = engine.findCardInZone("south", "character", op07Foxy071);
    engine.playCard(op07MegatonNineTailsRush078);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [foxyId] }, "south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === foxyId)
        ?.rested,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps the optional active DON!! addition", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op07MegatonNineTailsRush078] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");
    expect(engine.getView("north").players.north.activeDon).toBe(1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
