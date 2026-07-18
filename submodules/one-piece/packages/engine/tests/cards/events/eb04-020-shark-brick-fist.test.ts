import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Arlong011,
  eb02Jinbe055,
  op01Okiku035,
  op06HodyJones020,
  op14eb04SharkBrickFist020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-020 Shark Brick Fist", () => {
  test("maps the ordered Fish-Man Counter power and Character-reactivation choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Okiku035, playedOnTurn: 0 }],
      },
      {
        leaderCardId: op06HodyJones020,
        hand: [op14eb04SharkBrickFist020],
        character: [eb02Arlong011, eb02Jinbe055],
        activeDon: 1,
        life: 2,
      },
    );
    const attackerId = engine.findCardInZone("south", "character", op01Okiku035);
    const eventId = engine.findCardInZone("north", "hand", op14eb04SharkBrickFist020);
    const restedFishManId = engine.findCardInZone("north", "character", eb02Arlong011);
    const otherFishManId = engine.findCardInZone("north", "character", eb02Jinbe055);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.attachDon(attackerId, 1, "south");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedFishManId] }, "south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === restedFishManId)?.rested,
    ).toBe(true);
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the defender to receive the Fish-Man power choice.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("north"),
      restedFishManId,
      otherFishManId,
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
      throw new Error("Expected the defender to receive the Fish-Man activation choice.");
    }
    expect(activeStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      restedFishManId,
      otherFishManId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restedFishManId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restedFishManId)?.rested,
    ).toBe(false);
    expect(view.players.north.lifeCount).toBe(2);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the damaged player rest only an opposing cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, eb01Doma005, eb01Fourtricks025],
      },
      {
        life: [op14eb04SharkBrickFist020],
      },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const firstEligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const selectedId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.endTurn("south");
    engine.endTurn("north");
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "north");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to receive the opposing Character choice.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      firstEligibleId,
      selectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(attackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === attackerId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
