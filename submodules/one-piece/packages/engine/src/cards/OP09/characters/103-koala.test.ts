import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05BeloBetty015 } from "@tcg/op-cards";
import { op09Koala103 } from "../../../../../cards/src/cards/characters/op09-103-koala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-103 Koala", () => {
  test("pays with top or bottom Life before playing a Revolutionary Army Character and drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Koala103, op05BeloBetty015],
      life: [eb01Doma005, eb01Doma005],
      deck: [eb01Doma005],
      activeDon: op09Koala103.cost,
    });

    engine.playCard(op09Koala103, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const lifeCost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    if (lifeCost?.kind !== "chooseOption") {
      throw new Error("Expected Koala's printed top-or-bottom Life cost.");
    }
    expect(lifeCost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Koala103, op05BeloBetty015],
      life: [eb01Doma005, eb01Doma005],
      deck: [eb01Doma005],
      activeDon: op09Koala103.cost,
    });
    engine.playCard(op09Koala103, "south");
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
