import { describe, expect, test } from "vite-plus/test";
import { op13Higuma013, op13Otama043, op13WindmillVillage022 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-022 Windmill Village", () => {
  test("lets its controller choose an eligible Character for the turn's power bonus", () => {
    const engine = OnePieceTestEngine.create({
      stage: op13WindmillVillage022,
      character: [op13Otama043, op13Otama043, op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", op13WindmillVillage022);
    const eligibleId = engine.findCardInZone("south", "character", op13Otama043);
    const ineligibleId = engine.findCardInZone("south", "character", op13Higuma013);
    const otherEligibleId = engine
      .getView("south")
      .players.south.characters.find(
        (card) => card?.cardId === op13Otama043.id && card.instanceId !== eligibleId,
      )?.instanceId;
    if (!otherEligibleId) {
      throw new Error("Expected a second eligible Character fixture.");
    }

    engine.activateEffect(stageId, "activateMain");

    const confirmation = engine.pendingDecision("effectOptional", "south");
    expect(confirmation).toMatchObject({
      actorId: "south",
      kind: "confirm",
      submit: { commandType: "resolvePrompt", promptId: confirmation.id },
    });

    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Windmill Village to publish a Character selection.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      eligibleId,
      otherEligibleId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.power,
    ).toBe(1000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === otherEligibleId)?.power,
    ).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ineligibleId)?.power,
    ).toBe(3000);
    expect(view.prompts).toHaveLength(0);
  });
});
