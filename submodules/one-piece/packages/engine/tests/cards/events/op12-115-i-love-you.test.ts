import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op12ILoveYou115, op12TrafalgarLaw073 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP12-115 I Love You!!", () => {
  test("Counter grants +2000 and recovers Trafalgar Law at two Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op12ILoveYou115],
        trash: [op12TrafalgarLaw073],
        activeDon: 1,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op12ILoveYou115);
    const lawId = engine.findCardInZone("north", "trash", op12TrafalgarLaw073);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(lawId);
    expect(view.logs.some((entry) => entry.message.includes("+2000 power"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("three Life prevents Law recovery even if battle damage then reduces Life to two", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op12ILoveYou115, "EB01-005"], trash: [op12TrafalgarLaw073], activeDon: 1, life: 3 },
    );
    const law = engine.findCardInZone("north", "trash", op12TrafalgarLaw073);
    engine
      .asSouth()
      .attack(
        engine.findCardInZone("south", "character", eb01MountainGod018),
        engine.leader("north"),
      );
    engine.asNorth().chooseCounter(op12ILoveYou115);
    engine.asNorth().chooseTargets(engine.leader("north"));
    expect(engine.getView("north").players.north.leader.power).toBe(7000);
    expect(engine.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(law);
    engine.asNorth().chooseCounter();
    expect(engine.getView("north").players.north.lifeCount).toBe(2);
    expect(engine.getView("north").players.north.hand.map((c) => c.instanceId)).not.toContain(law);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
