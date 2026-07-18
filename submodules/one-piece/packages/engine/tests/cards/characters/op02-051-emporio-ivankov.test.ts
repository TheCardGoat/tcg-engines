import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op02BoaHancock059,
  op02EmporioIvankov051,
  op02Saldeath074,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-051 Emporio.Ivankov", () => {
  test("fills its hand to 3, then plays only a blue cost-6-or-less Impel Down Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02EmporioIvankov051, op02BoaHancock059],
      deck: [op02Saldeath074, op02EmporioIvankov051, eb01Doma005],
      activeDon: op02EmporioIvankov051.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op02BoaHancock059);
    const wrongColorId = engine.findCardInZone("south", "deck", op02Saldeath074);
    const wrongCostId = engine.findCardInZone("south", "deck", op02EmporioIvankov051);
    const undrawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op02EmporioIvankov051, "south");

    const handAfterDraw = engine.getView("south").players.south.hand.map((card) => card.instanceId);
    expect(handAfterDraw).toEqual([eligibleId, wrongColorId, wrongCostId]);
    expect(handAfterDraw).not.toContain(undrawnId);

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Ivankov's play choice.");
    const candidateIds = play.candidates.map((candidate) => candidate.ref.id);
    expect(candidateIds).toContain(eligibleId);
    expect(candidateIds).not.toContain(wrongColorId);
    expect(candidateIds).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
