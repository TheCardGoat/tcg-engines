import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-149", () => {
  test("high-cost Character enables draw two discard one and Character-only Rush", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-149"], activeDon: 5, deck: ["EB01-005", "EB01-025", "EB01-018"] },
      { character: ["OP16-003", { cardId: "EB01-005", rested: true }] },
    );
    const drawn = e.findCardInZone("south", "deck", "EB01-005");
    e.playCard("P-149");
    expect(e.getView("south").players.south.hand).toHaveLength(2);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawn] }, "south");
    const id = e.findCardInZone("south", "character", "P-149");
    e.expectFailure({
      type: "declareAttack",
      seat: "south",
      attackerId: id,
      targetId: e.leader("north"),
    });
    e.asSouth().attack("P-149", "EB01-005");
    expect(e.getView("south").players.north.trash.map((c) => c.cardId)).toContain("EB01-005");
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("without qualifying field cost it skips draw and discard", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-149"],
      activeDon: 5,
      deck: ["EB01-005", "EB01-025"],
    });
    e.playCard("P-149");
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("a reduced cost-zero Character also enables the draw and discard", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP02-106", "P-149"], activeDon: 6, deck: ["EB01-005", "EB01-025", "EB01-018"] },
      { character: ["EB01-005"] },
    );
    e.playCard("OP02-106");
    e.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [e.findCardInZone("north", "character", "EB01-005")] },
      "south",
    );
    e.playCard("P-149");
    const hand = e.getView("south").players.south.hand;
    expect(hand).toHaveLength(2);
    e.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [hand[0]!.instanceId!] },
      "south",
    );
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
});
