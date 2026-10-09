import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-006-jinbe", () => {
  test("pays exact6000 Character discard and draws2", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST30-006", "ST30-005", "ST30-013", "ST21-006"],
      activeDon: 5,
      deck: ["ST21-005", "ST21-008", "ST21-013"],
    });
    e.playCard("ST30-006");
    e.asSouth().acceptOptional();
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST30-005")] },
      "south",
    );
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.handCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST30-005");
  });
  test("declines optional discard with eligible card", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST30-006", "ST30-005"], activeDon: 5, deck: 10 });
    e.playCard("ST30-006");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
  test("wrong-power hand Character cannot pay", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST30-006", "ST21-006"], activeDon: 5, deck: 10 });
    e.playCard("ST30-006");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
  });
});
