import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05MonkeyDGarp054,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-054 Monkey.D.Garp", () => {
  test("draws two, then bottoms exactly two chosen hand cards in submitted order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05MonkeyDGarp054, eb01Fourtricks025],
      deck: [eb01Doma005, eb01MountainGod018, eb01Fourtricks025],
      activeDon: op05MonkeyDGarp054.cost,
    });
    const existingHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op05MonkeyDGarp054, "south");
    const bottom = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(bottom?.kind).toBe("selectEntity");
    if (bottom?.kind !== "selectEntity") throw new Error("Expected Garp's hand-bottom choice.");
    expect(bottom).toMatchObject({ min: 2, max: 2 });
    expect(bottom.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([existingHandId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [secondDrawId, existingHandId] },
      "south",
    );

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondDrawId, existingHandId]);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      firstDrawId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
