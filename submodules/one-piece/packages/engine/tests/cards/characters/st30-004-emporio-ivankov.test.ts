import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-004-emporio-ivankov", () => {
  test("reveals two exact6000 Characters then draws3 and discards2", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-004", "ST30-005", "ST30-013", "ST21-006", "ST21-016", "ST21-008"],
      activeDon: 3,
      deck: ["ST21-005", "ST21-006", "ST21-008", "ST21-013"],
    });
    const first = e.findCardInZone("south", "hand", "ST30-005"),
      second = e.findCardInZone("south", "hand", "ST30-013");
    e.playCard("ST30-004");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostRevealFromHand", { selectedIds: [first, second] }, "south");
    expect(e.getView("south").players.south.handCount).toBe(8);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [first, second] }, "south");
    expect(e.getView("south").players.south.handCount).toBe(6);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("declines optional reveal payment and keeps hand and deck", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-004", "ST30-005", "ST30-013"],
      activeDon: 3,
      deck: 10,
    });
    e.playCard("ST30-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("one6000 Character plus nonmatching card cannot pay", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-004", "ST30-005", "ST21-006"],
      activeDon: 3,
      deck: 10,
    });
    e.playCard("ST30-004");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
});
