import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03OneTwoJango039,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-039 One, Two, Jango", () => {
  test("orders the opposing cost-1 rest choice before the own-Character power choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03OneTwoJango039],
        character: [eb01MountainGod018],
        activeDon: 1,
      },
      {
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const powerTargetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const restTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const powerBefore = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === powerTargetId)?.power;
    if (powerBefore === undefined || powerBefore === null) {
      throw new Error("Expected the own Character to expose its current power.");
    }

    engine.playCard(op03OneTwoJango039);

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose an opposing low-cost Character.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([restTargetId]);
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [restTargetId] }, "south");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "south");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to choose one of their Characters for power.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([powerTargetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [powerTargetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === restTargetId)?.rested,
    ).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === powerTargetId)?.power,
    ).toBe(powerBefore + 1000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === powerTargetId)?.power,
    ).toBe(powerBefore);
  });
});
