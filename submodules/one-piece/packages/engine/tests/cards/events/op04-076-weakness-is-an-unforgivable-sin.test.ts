import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04WeaknessIsAnUnforgivableSin076,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function leaderPower(engine: OnePieceTestEngine, seat: "south" | "north") {
  const power = engine.getView(seat).players[seat].leader.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Leader to expose its current power.");
  }
  return power;
}

describe("OP04-076 Weakness...Is an Unforgivable Sin.", () => {
  test("maps DON!! -1 and the Leader-or-Character Counter recipient through turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }],
      },
      {
        hand: [op04WeaknessIsAnUnforgivableSin076],
        character: [eb01Doma005],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const eventId = engine.findCardInZone("north", "hand", op04WeaknessIsAnUnforgivableSin076);
    const characterId = engine.findCardInZone("north", "character", eb01Doma005);
    const powerBefore = leaderPower(engine, "north");
    const lifeBefore = engine.getView("north").players.north.lifeCount;
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const donDecision = engine.pendingDecision("effectCostReturnDon", "north");
    const donStep = donDecision.steps[0];
    expect(donStep?.kind).toBe("payCost");
    if (donStep?.kind !== "payCost") {
      throw new Error("Expected the defender to choose the DON!! returned after Event payment.");
    }
    expect(donStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      "active-don:0",
      "rested-don:0",
    ]);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose their Leader or Character recipient.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      characterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(leaderPower(engine, "north")).toBe(powerBefore + 1000);
    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.players.north).toMatchObject({
      activeDon: 0,
      restedDon: 1,
      donDeckCount: donDeckBefore + 1,
    });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(leaderPower(engine, "north")).toBe(powerBefore);
  });

  test("Life Trigger maps the optional active DON!! count without payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04WeaknessIsAnUnforgivableSin076],
        donDeckCount: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "north");

    const view = engine.getView("north");
    expect(view.players.north).toMatchObject({ activeDon: 1, restedDon: 0, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
