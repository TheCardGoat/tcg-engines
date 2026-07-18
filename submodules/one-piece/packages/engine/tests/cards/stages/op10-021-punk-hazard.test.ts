import { describe, expect, test } from "vite-plus/test";
import { op10CaesarClown002, op10Monet016, op10PunkHazard021 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-021 Punk Hazard", () => {
  test("lets Caesar Clown choose a rested DON!! count and its Leader-or-Character recipient", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10CaesarClown002,
      stage: op10PunkHazard021,
      character: [op10Monet016],
      restedDon: 2,
    });
    const stageId = engine.findCardInZone("south", "stage", op10PunkHazard021);
    const characterId = engine.findCardInZone("south", "character", op10Monet016);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const countDecision = engine.pendingDecision("effectGiveDonCount", "south");
    const countStep = countDecision.steps[0];
    expect(countDecision.actorId).toBe("south");
    expect(countStep?.kind).toBe("chooseOption");
    if (countStep?.kind !== "chooseOption") {
      throw new Error("Expected Punk Hazard to publish its DON!! count choice.");
    }
    expect(countStep.options.map((option) => option.id)).toEqual(["0", "1"]);
    expect(engine.getView("south").players.south.stage?.rested).toBe(true);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipientDecision = engine.pendingDecision("effectTargetSelection", "south");
    const recipientStep = recipientDecision.steps[0];
    expect(recipientStep?.kind).toBe("selectEntity");
    if (recipientStep?.kind !== "selectEntity") {
      throw new Error("Expected Punk Hazard to publish its DON!! recipient choice.");
    }
    expect(recipientStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      characterId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ restedDon: 1, activeDon: 0 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === characterId)?.attachedDon,
    ).toBe(1);
    expect(view.players.south.leader.attachedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("can rest the Stage before a non-Caesar Leader makes the effect do nothing", () => {
    const engine = OnePieceTestEngine.create({
      stage: op10PunkHazard021,
      restedDon: 1,
    });
    const stageId = engine.findCardInZone("south", "stage", op10PunkHazard021);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
