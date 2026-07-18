import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05BeloBetty015 } from "@tcg/op-cards";
import { op09Koala103 } from "../../../../../cards/src/cards/OP09/characters/103-koala.ts";

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
  });
});
