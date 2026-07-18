import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, prb01ShockwaveJollyRogerFoil014 } from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("ST06-014 Shockwave reprint", () => {
  test("Counter grants +4000, then K.O.s a separate active cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { hand: [prb01ShockwaveJollyRogerFoil014], activeDon: 2 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const koId = engine.findCardInZone("south", "character", eb01Doma005);
    const eventId = engine.findCardInZone("north", "hand", prb01ShockwaveJollyRogerFoil014);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [koId] }, "north");
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      koId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });

  test("Life Trigger K.O.s an opposing cost-4-or-less Character without requiring it active", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, rested: true },
        ],
      },
      { life: [prb01ShockwaveJollyRogerFoil014] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
