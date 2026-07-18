import { describe, expect, test } from "vite-plus/test";
import {
  op08Carrot021,
  op08Carrot023,
  op08Inuarashi022,
  op08Zou039,
  op13Higuma013,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-039 Zou", () => {
  test("a non-Minks Leader still pays the pre-colon Stage-rest cost but sets no DON!! active", () => {
    const engine = OnePieceTestEngine.create({
      stage: op08Zou039,
      restedDon: 1,
    });
    const stageId = engine.findCardInZone("south", "stage", op08Zou039);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("executes its controller's DON!! and Minks activation choices in printed timing order", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08Carrot021,
      stage: op08Zou039,
      character: [
        { card: op08Carrot023, rested: true },
        { card: op08Inuarashi022, rested: true },
        { card: op13Higuma013, rested: true },
      ],
      restedDon: 2,
    });
    const stageId = engine.findCardInZone("south", "stage", op08Zou039);
    const exactTypeId = engine.findCardInZone("south", "character", op08Carrot023);
    const compositeTypeId = engine.findCardInZone("south", "character", op08Inuarashi022);
    const unrelatedId = engine.findCardInZone("south", "character", op13Higuma013);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const donDecision = engine.pendingDecision("effectSetActiveDon", "south");
    const donStep = donDecision.steps[0];
    expect(donDecision.actorId).toBe("south");
    expect(donStep?.kind).toBe("chooseOption");
    if (donStep?.kind !== "chooseOption") {
      throw new Error("Expected Zou to publish a DON!! count choice.");
    }
    expect(donStep.options.map((option) => option.id)).toEqual(["0", "1"]);

    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.restedDon).toBe(1);

    engine.endTurn("south");

    const characterDecision = engine.pendingDecision("effectTargetSelection", "south");
    const characterStep = characterDecision.steps[0];
    expect(characterDecision.actorId).toBe("south");
    expect(characterStep?.kind).toBe("selectEntity");
    if (characterStep?.kind !== "selectEntity") {
      throw new Error("Expected Zou to publish its Minks Character selection.");
    }
    expect(characterStep).toMatchObject({ min: 0, max: 1 });
    expect(characterStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      exactTypeId,
      compositeTypeId,
    ]);
    expect(characterStep.candidates.some((candidate) => candidate.ref.id === unrelatedId)).toBe(
      false,
    );

    engine.resolveDecision("effectTargetSelection", { selectedIds: [compositeTypeId] }, "south");

    view = engine.getView("south");
    const restedById = new Map(
      view.players.south.characters.flatMap((card) =>
        card ? [[card.instanceId, card.rested] as const] : [],
      ),
    );
    expect(restedById.get(exactTypeId)).toBe(true);
    expect(restedById.get(compositeTypeId)).toBe(false);
    expect(restedById.get(unrelatedId)).toBe(true);
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
