import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11CharlotteKatakuri062 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP11-062 Charlotte Katakuri", () => {
  test("returns one DON, privately looks at the opposing top card, and gains battle power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11CharlotteKatakuri062, activeDon: 1 },
      { deck: [eb01Doma005], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );

    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");
    // When Attacking DON!! −1 is optional; accept so the look + power gain resolve.
    engine.accept("south");
    try {
      engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    } catch {
      // Cost auto-paid.
    }

    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    expect(
      engine.getView("south").logs.some((entry) => entry.message.includes(eb01Doma005.name)),
    ).toBe(true);
    expect(
      engine.getView("north").logs.some((entry) => entry.message.includes(eb01Doma005.name)),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: op11CharlotteKatakuri062, activeDon: 1 },
      { deck: [eb01Doma005], hand: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(engine.leader("south"), engine.leader("north"), "south");

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
