import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, prb01GuardPointJollyRogerFoil014 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST01-014 Guard Point reprint", () => {
  test("Counter grants +3000 to the chosen defending Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [prb01GuardPointJollyRogerFoil014], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", prb01GuardPointJollyRogerFoil014);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
  });

  test("Life Trigger grants +1000 for the turn to a chosen card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [prb01GuardPointJollyRogerFoil014], character: [eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const recipientId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === recipientId)?.power,
    ).toBe(4000);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
