import { describe, expect, test } from "vite-plus/test";
import {
  op11FishManIsland117,
  op11Hatchan034,
  op11Otohime100,
  op11ScaledNeptunian026,
  op11Shirahoshi022,
  op13Higuma013,
  op13Otama043,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-117 Fish-Man Island", () => {
  test("a non-Shirahoshi Leader cannot activate or turn the Life cost face-up", () => {
    const engine = OnePieceTestEngine.create({
      stage: op11FishManIsland117,
      life: [op13Otama043],
      character: [op11Hatchan034],
    });
    const stageId = engine.findCardInZone("south", "stage", op11FishManIsland117);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: stageId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation conditions are not met.");
    expect(engine.getView("south").players.south.life[0]).toMatchObject({ hidden: true });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("turns the top Life face-up and gives an eligible Character +1000 power once per turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op11Shirahoshi022,
      stage: op11FishManIsland117,
      life: [op13Otama043],
      character: [op11Hatchan034, op11Otohime100, op11ScaledNeptunian026, op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", op11FishManIsland117);
    const fishManId = engine.findCardInZone("south", "character", op11Hatchan034);
    const merfolkId = engine.findCardInZone("south", "character", op11Otohime100);
    const neptunianId = engine.findCardInZone("south", "character", op11ScaledNeptunian026);
    const ineligibleId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Fish-Man Island to publish its Character selection.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      fishManId,
      merfolkId,
      neptunianId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    for (const viewer of ["south", "north"] as const) {
      expect(engine.getView(viewer).players.south.life[0]).toMatchObject({
        cardId: op13Otama043.id,
        hidden: false,
      });
    }

    engine.resolveDecision("effectTargetSelection", { selectedIds: [fishManId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(false);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fishManId)?.power,
    ).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === merfolkId)?.power,
    ).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === neptunianId)?.power,
    ).toBe(8000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ineligibleId)?.power,
    ).toBe(3000);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: stageId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === fishManId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
