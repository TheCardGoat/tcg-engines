import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST17-001 Crocodile", () => {
  test("FAQ qualifying revealed top is one of two drawn before one hand card returns top", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST17-001", "ST12-009"],
      deck: ["ST17-004", "ST12-015", "ST12-004"],
      activeDon: 4,
    });
    const revealed = e.findCardInZone("south", "deck", "ST17-004"),
      second = e.findCardInZone("south", "deck", "ST12-015"),
      put = e.findCardInZone("south", "hand", "ST12-009");
    e.playCard("ST17-001");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual(
      expect.arrayContaining([revealed, second]),
    );
    e.asSouth().chooseTargets(put);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    e.endTurn("south");
    e.endTurn("north");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(put);
  });
  test("non-Warlord stays top without draw or hand return", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST17-001", "ST12-015"],
      deck: ["ST12-009", "ST12-004"],
      activeDon: 4,
    });
    const top = e.findCardInZone("south", "deck", "ST12-009");
    e.playCard("ST17-001");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.deckCount).toBe(2);
    expect(e.getView("south").prompts).toHaveLength(0);
    e.endTurn("south");
    e.endTurn("north");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(top);
  });
});
