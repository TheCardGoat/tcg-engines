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

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01CharlotteFlampe056],
      deck: [eb01MountainGod018, eb01Doma005],
      life: [eb01Doma005, eb01Fourtricks025],
      activeDon: 1,
    });
    engine.playCard(eb01CharlotteFlampe056, "south");
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
