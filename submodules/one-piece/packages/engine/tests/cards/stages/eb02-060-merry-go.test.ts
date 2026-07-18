import { describe, expect, test } from "vite-plus/test";
import {
  eb02MerryGo060,
  op11NicoRobin009,
  op13Higuma013,
  op13Otama043,
  op13RoronoaZoro037,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-060 Merry Go", () => {
  test("turns the top Life face-up and gives a chosen Straw Hat Crew Character +1000 power through the opponent's next turn", () => {
    const noLifeEngine = OnePieceTestEngine.create({
      stage: eb02MerryGo060,
      life: 0,
    });
    const unavailableStageId = noLifeEngine.findCardInZone("south", "stage", eb02MerryGo060);
    expect(
      noLifeEngine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: unavailableStageId,
        trigger: "activateMain",
      }).reason,
    ).toBe("The activation costs cannot be paid.");
    expect(noLifeEngine.getView("south").players.south.stage?.rested).toBe(false);
    expect(noLifeEngine.getView("south").prompts).toHaveLength(0);

    const engine = OnePieceTestEngine.create({
      stage: eb02MerryGo060,
      life: [op13Otama043, op13Higuma013],
      character: [op13RoronoaZoro037, op11NicoRobin009, op13Higuma013],
    });
    const stageId = engine.findCardInZone("south", "stage", eb02MerryGo060);
    const selectedId = engine.findCardInZone("south", "character", op13RoronoaZoro037);
    const unselectedId = engine.findCardInZone("south", "character", op11NicoRobin009);
    const ineligibleId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetDecision.actorId).toBe("south");
    expect(targetStep?.kind).toBe("selectEntity");
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected Merry Go to publish its Character selection.");
    }
    expect(targetStep).toMatchObject({ min: 0, max: 1 });
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedId,
      unselectedId,
    ]);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);

    for (const viewer of ["south", "north"] as const) {
      const life = engine.getView(viewer).players.south.life;
      expect(life[0]).toMatchObject({ cardId: op13Otama043.id, hidden: false });
      expect(life[1]).toMatchObject({ cardId: null, hidden: true });
    }

    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(6000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === unselectedId)?.power,
    ).toBe(4000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(6000);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
