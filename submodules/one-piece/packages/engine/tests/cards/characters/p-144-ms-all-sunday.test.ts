import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-144", () => {
  test("can pay by K.O.ing itself and then draws", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-144"],
      activeDon: 5,
      deck: ["EB01-005", "EB01-025"],
    });
    const draw = e.findCardInZone("south", "deck", "EB01-005");
    e.playCard("P-144");
    const source = e.findCardInZone("south", "character", "P-144");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(source);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([draw]);
  });
  test("declining preserves itself and the deck", () => {
    const e = OnePieceTestEngine.create({
      hand: ["P-144"],
      activeDon: 5,
      deck: ["EB01-005", "EB01-025"],
    });
    e.playCard("P-144");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("P-144");
  });
});
