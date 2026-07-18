import { describe, expect, test } from "vite-plus/test";
import {
  eb01CharlotteFlampe056,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-056 Charlotte Flampe", () => {
  test("optionally pays with top or bottom Life before drawing one card", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01CharlotteFlampe056],
      deck: [eb01MountainGod018, eb01Doma005],
      life: [eb01Doma005, eb01Fourtricks025],
      activeDon: 1,
    });
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;
    const drawnId = engine.getState().players.south.deck[0]!;

    engine.playCard(eb01CharlotteFlampe056);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(cost?.kind).toBe("chooseOption");
    if (cost?.kind !== "chooseOption") {
      throw new Error("Expected Flampe's top-or-bottom Life cost choice.");
    }
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const handIds = engine.getView("south").players.south.hand.map((card) => card.instanceId);
    expect(handIds).toEqual(expect.arrayContaining([bottomLifeId, drawnId]));
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
