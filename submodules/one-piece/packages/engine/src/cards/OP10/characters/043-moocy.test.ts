import { describe, expect, test } from "vite-plus/test";
import { op04CorridaColiseum096, op04Rebecca039 } from "@tcg/op-cards";
import { op10Moocy043 } from "../../../../../cards/src/cards/OP10/characters/043-moocy.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-043 Moocy", () => {
  test("accepts either a Dressrosa Leader or Stage as its rest cost", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Moocy043],
      stage: op04CorridaColiseum096,
      activeDon: op10Moocy043.cost,
    });
    engine.playCard(op10Moocy043, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostRestCards", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Moocy's Leader-or-Stage rest cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([
        engine.leader("south"),
        engine.findCardInZone("south", "stage", op04CorridaColiseum096),
      ]),
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op04Rebecca039,
      hand: [op10Moocy043],
      stage: op04CorridaColiseum096,
      activeDon: op10Moocy043.cost,
    });
    engine.playCard(op10Moocy043, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
