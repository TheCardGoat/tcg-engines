import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op14eb04GroundDeath096,
  op14eb04Kuroobi045,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP14-096 Ground Death", () => {
  test("Main rests two DON!! and negates an opposing cost-5-or-less Character for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04GroundDeath096],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 3,
      },
      { character: [{ card: op14eb04Kuroobi045, rested: true }, eb01Doma005] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("north", "character", op14eb04Kuroobi045);
    engine.playCard(op14eb04GroundDeath096);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 3 });
    engine.declareAttack(attackerId, targetId, "south");
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("north").players.north.hand).toHaveLength(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter grants +4000 at ten trash cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op14eb04GroundDeath096], trash: 10, activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04GroundDeath096);
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
