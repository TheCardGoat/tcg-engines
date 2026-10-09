import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st36-004-bartolomeo", () => {
  test("pays a Supernovas card then draws two", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST36-004", "ST02-016", "ST36-002", "ST21-013"],
      activeDon: 1,
      deck: ["ST21-005", "ST21-006", "ST21-008"],
    });
    e.playCard("ST36-004");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (p?.kind !== "payCost") throw Error("payment");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "hand", "ST21-013"),
    );
    e.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [e.findCardInZone("south", "hand", "ST02-016")] },
      "south",
    );
    expect(e.getView("south").players.south.handCount).toBe(4);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("ST02-016");
  });
  test("declines optional Supernovas discard", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST36-004", "ST36-002"], activeDon: 1, deck: 3 });
    e.playCard("ST36-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(3);
  });
  test("wrong-trait hand cannot pay", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST36-004", "ST21-013"], activeDon: 1, deck: 3 });
    e.playCard("ST36-004");
    expect(e.getView("south").prompts).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(3);
  });
});
