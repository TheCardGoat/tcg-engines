import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-006 Sasaki", () => {
  test("pays DON to draw one card", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST04-006"], activeDon: 4, deck: 10 });
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().play("ST04-006");

    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");

    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 1);
  });
  test("declines DON payment and does not draw", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST04-006"], activeDon: 4, deck: 10 });
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().play("ST04-006");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(deck - 0);
  });
});
