import { describe, expect, test } from "vite-plus/test";
import {
  op06GeckoMoria080,
  op06JigoroOfTheWind084,
  op06Oars083,
  op06ThrillerBark098,
  op12Perona034,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-098 Thriller Bark", () => {
  test("declining the optional activation pays neither rest cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      stage: op06ThrillerBark098,
      trash: [op06JigoroOfTheWind084],
      activeDon: 1,
    });
    const stageId = engine.findCardInZone("south", "stage", op06ThrillerBark098);
    const trashId = engine.findCardInZone("south", "trash", op06JigoroOfTheWind084);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(engine.getView("south").players.south.stage?.rested).toBe(false);
    expect(engine.getState().players.south.trash).toContain(trashId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("pays both rest costs and lets its controller play an eligible trash Character rested", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      stage: op06ThrillerBark098,
      trash: [op12Perona034, op06JigoroOfTheWind084, op06Oars083, op13Higuma013],
      activeDon: 1,
    });
    const stageId = engine.findCardInZone("south", "stage", op06ThrillerBark098);
    const compositeEligibleId = engine.findCardInZone("south", "trash", op12Perona034);
    const exactEligibleId = engine.findCardInZone("south", "trash", op06JigoroOfTheWind084);
    const highCostId = engine.findCardInZone("south", "trash", op06Oars083);
    const wrongTypeId = engine.findCardInZone("south", "trash", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playDecision.actorId).toBe("south");
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected Thriller Bark to publish its trash play selection.");
    }
    expect(playStep).toMatchObject({ min: 0, max: 1 });
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      compositeEligibleId,
      exactEligibleId,
    ]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTypeId);

    engine.resolveDecision("effectPlaySelection", { selectedIds: [compositeEligibleId] }, "south");

    const view = engine.getView("south");
    const playedCard = view.players.south.characters.find(
      (card) => card?.instanceId === compositeEligibleId,
    );
    expect(playedCard).toMatchObject({ cardId: op12Perona034.id, rested: true });
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      exactEligibleId,
      highCostId,
      wrongTypeId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("the Leader condition is checked after costs, so a wrong Leader pays but plays nothing", () => {
    const engine = OnePieceTestEngine.create({
      stage: op06ThrillerBark098,
      trash: [op06JigoroOfTheWind084],
      activeDon: 1,
    });
    const stageId = engine.findCardInZone("south", "stage", op06ThrillerBark098);
    const trashId = engine.findCardInZone("south", "trash", op06JigoroOfTheWind084);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.players.south.stage?.rested).toBe(true);
    expect(engine.getState().players.south.trash).toContain(trashId);
    expect(view.players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
