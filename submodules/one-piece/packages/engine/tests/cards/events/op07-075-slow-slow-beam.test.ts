import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07SlowSlowBeam075 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP07-075 Slow-Slow Beam", () => {
  test("Counter returns DON!! and gives separate opposing Leader and Character power choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005],
      },
      {
        hand: [op07SlowSlowBeam075],
        life: 2,
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", op07SlowSlowBeam075);
    const leaderPowerBefore = engine.getView("north").players.south.leader.power!;
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    expect(engine.getView("north").players.south.leader.power).toBe(leaderPowerBefore - 2000);
    expect(
      engine
        .getView("north")
        .players.south.characters.find((card) => card?.instanceId === characterId)?.power,
    ).toBe(1000);
    expect(engine.getView("north").players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
