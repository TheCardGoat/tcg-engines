import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Hack012,
  op07SlowSlowBeamSword076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-076 Slow-Slow Beam Sword", () => {
  test("Counter returns DON!! before the recipient choice and opposing Character rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op05Hack012, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        hand: [op07SlowSlowBeamSword076],
        life: 2,
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op05Hack012);
    const restId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op07SlowSlowBeamSword076);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === restId)
        ?.rested,
    ).toBe(true);
    expect(engine.getView("north").players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers a 0-or-1 active DON!! addition without Counter payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op07SlowSlowBeamSword076],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const addDecision = engine.pendingDecision("effectAddDon", "north");
    expect(addDecision.steps[0]).toMatchObject({
      kind: "chooseOption",
      options: [
        { id: "0", value: "0" },
        { id: "1", value: "1" },
      ],
    });
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    expect(engine.getView("north").players.north).toMatchObject({ activeDon: 1, donDeckCount: 9 });
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
