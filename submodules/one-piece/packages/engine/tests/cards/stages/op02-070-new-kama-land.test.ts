import { describe, expect, test } from "vite-plus/test";
import {
  op02EmporioIvankov049,
  op02NewKamaLand070,
  op13Higuma013,
  op13KouzukiMomonosuke105,
  op13Otama043,
  op13York094,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-070 New Kama Land", () => {
  test("without Emporio.Ivankov, skips the conditioned exchange but still allows the trailing trash", () => {
    const engine = OnePieceTestEngine.create({
      stage: op02NewKamaLand070,
      hand: [op13Higuma013, op13Otama043],
      deck: [op13York094],
    });
    const stageId = engine.findCardInZone("south", "stage", op02NewKamaLand070);
    const higumaId = engine.findCardInZone("south", "hand", op13Higuma013);
    const otamaId = engine.findCardInZone("south", "hand", op13Otama043);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const trashDecision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const trashStep = trashDecision.steps[0];
    expect(trashStep?.kind).toBe("selectEntity");
    if (trashStep?.kind !== "selectEntity") {
      throw new Error("Expected New Kama Land's unconditional up-to hand-trash choice.");
    }
    expect(trashStep).toMatchObject({ min: 0, max: 2 });
    expect(trashStep.candidates.map((candidate) => candidate.ref.id)).toEqual([higumaId, otamaId]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [higumaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([otamaId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(higumaId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("with Emporio.Ivankov, draws before its exact and up-to hand-trash choices", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02EmporioIvankov049,
      stage: op02NewKamaLand070,
      hand: [op13Higuma013, op13Otama043, op13KouzukiMomonosuke105],
      deck: [op13York094],
    });
    const stageId = engine.findCardInZone("south", "stage", op02NewKamaLand070);
    const higumaId = engine.findCardInZone("south", "hand", op13Higuma013);
    const otamaId = engine.findCardInZone("south", "hand", op13Otama043);
    const momonosukeId = engine.findCardInZone("south", "hand", op13KouzukiMomonosuke105);
    const drawnYorkId = engine.findCardInZone("south", "deck", op13York094);

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const exactDecision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const exactStep = exactDecision.steps[0];
    expect(exactDecision.actorId).toBe("south");
    expect(exactStep?.kind).toBe("selectEntity");
    if (exactStep?.kind !== "selectEntity") {
      throw new Error("Expected New Kama Land to publish its exact hand-trash choice.");
    }
    expect(exactStep.min).toBe(1);
    expect(exactStep.max).toBe(1);
    expect(exactStep.candidates.map((candidate) => candidate.ref.id)).toContain(drawnYorkId);

    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawnYorkId] }, "south");

    const optionalDecision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    const optionalStep = optionalDecision.steps[0];
    expect(optionalStep?.kind).toBe("selectEntity");
    if (optionalStep?.kind !== "selectEntity") {
      throw new Error("Expected New Kama Land to publish its up-to hand-trash choice.");
    }
    expect(optionalStep.min).toBe(0);
    expect(optionalStep.max).toBe(3);
    expect(optionalStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      higumaId,
      otamaId,
      momonosukeId,
    ]);

    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [higumaId, momonosukeId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.stage?.rested).toBe(true);
    expect(view.players.south.deckCount).toBe(0);
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([otamaId]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      drawnYorkId,
      higumaId,
      momonosukeId,
    ]);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
