import { describe, expect, test } from "vite-plus/test";
import {
  eb02Germa66039,
  op06VinsmokeIchiji060,
  op06VinsmokeIchiji061,
  op06VinsmokeJudge062,
  op06VinsmokeNiji064,
  op06VinsmokeNiji065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-039 GERMA 66", () => {
  test("at equal DON!!, maps the filtered discard and same-name 5000–7000 power play choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Germa66039, op06VinsmokeIchiji060, op06VinsmokeNiji064],
        trash: [op06VinsmokeIchiji061, op06VinsmokeNiji065, op06VinsmokeJudge062],
        activeDon: 4,
      },
      {
        activeDon: 4,
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb02Germa66039);
    const selectedCostId = engine.findCardInZone("south", "hand", op06VinsmokeIchiji060);
    const otherCostId = engine.findCardInZone("south", "hand", op06VinsmokeNiji064);
    const selectedPlayId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji061);
    const wrongNameId = engine.findCardInZone("south", "trash", op06VinsmokeNiji065);
    const tooPowerfulId = engine.findCardInZone("south", "trash", op06VinsmokeJudge062);

    engine.playCard(eb02Germa66039);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costDecision.actorId).toBe("south");
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected GERMA 66 to publish its filtered hand-trash cost.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedCostId,
      otherCostId,
    ]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [selectedCostId] }, "south");

    const playDecision = engine.pendingDecision("effectPlaySelection", "south");
    const playStep = playDecision.steps[0];
    expect(playDecision.actorId).toBe("south");
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected GERMA 66 to publish its same-name play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedPlayId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongNameId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedPlayId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === selectedPlayId)).toBe(
      true,
    );
    expect(view.players.south.hand.some((card) => card.instanceId === otherCostId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, selectedCostId, wrongNameId, tooPowerfulId]),
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("pays its printed cost before the post-colon DON!! comparison prevents the play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb02Germa66039, op06VinsmokeIchiji060, op06VinsmokeNiji064],
        trash: [op06VinsmokeIchiji061],
        activeDon: 5,
      },
      {
        activeDon: 4,
      },
    );
    const eventId = engine.findCardInZone("south", "hand", eb02Germa66039);
    const costId = engine.findCardInZone("south", "hand", op06VinsmokeIchiji060);
    const otherCostId = engine.findCardInZone("south", "hand", op06VinsmokeNiji064);
    const playId = engine.findCardInZone("south", "trash", op06VinsmokeIchiji061);

    engine.playCard(eb02Germa66039);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costDecision = engine.pendingDecision("effectCostTrashFromHand", "south");
    const costStep = costDecision.steps[0];
    expect(costStep?.kind).toBe("payCost");
    if (costStep?.kind !== "payCost") {
      throw new Error("Expected GERMA 66 to offer its cost before checking the DON!! totals.");
    }
    expect(costStep.candidates.map((candidate) => candidate.ref.id)).toEqual([costId, otherCostId]);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [costId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(costId);
    expect(view.players.south.hand.some((card) => card.instanceId === otherCostId)).toBe(true);
    expect(view.players.south.trash.some((card) => card.instanceId === playId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
