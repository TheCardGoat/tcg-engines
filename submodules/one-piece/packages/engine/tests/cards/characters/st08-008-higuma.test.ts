import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-008 Higuma", () => {
  test("On Play reduces opposing cost and expires at turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-008"], activeDon: 1 },
      { character: ["ST08-010"] },
    );
    e.playCard("ST08-008");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST08-010"));
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5 - 2);
    e.endTurn("south");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5);
  });
  test("On Play may choose no reduction target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-008"], activeDon: 1 },
      { character: ["ST08-010"] },
    );
    e.playCard("ST08-008");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(5);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("ST08-008");
  });
});
