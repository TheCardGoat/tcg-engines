import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op04Spiderweb035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function leaderPower(engine: OnePieceTestEngine, seat: "south" | "north") {
  const power = engine.getView(seat).players[seat].leader.power;
  if (power === undefined || power === null) {
    throw new Error("Expected the Leader to expose its current power.");
  }
  return power;
}

describe("OP04-035 Spiderweb", () => {
  test("maps Counter power before reactivating one of the defender's Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op04Spiderweb035],
        character: [{ card: eb01Fourtricks025, rested: true }],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op04Spiderweb035);
    const characterId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose their Counter power recipient.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      characterId,
    ]);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const activeDecision = engine.pendingDecision("effectTargetSelection", "north");
    const activeStep = activeDecision.steps[0];
    expect(activeStep?.kind).toBe("selectEntity");
    if (activeStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to choose a Character to reactivate.");
    }
    expect(activeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([characterId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === characterId)?.rested,
    ).toBe(false);
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps Leader power and expires it at the current turn end", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op04Spiderweb035],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = leaderPower(engine, "north");

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(leaderPower(engine, "north")).toBe(powerBefore + 2000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(leaderPower(engine, "north")).toBe(powerBefore);
  });
});
