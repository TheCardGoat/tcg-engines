import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST22-006 Jozu", () => {
  test("compound matching top is drawn before one hand card is trashed", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST22-006", "ST02-012"],
      activeDon: 7,
      deck: ["OP01-033", "ST02-002", "ST02-006"],
    });
    const top = e.findCardInZone("south", "deck", "OP01-033");
    e.asSouth().play("ST22-006");
    expect(e.getView("south").players.south.handCount).toBe(3);
    e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [top] }, "south");
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(top);
    expect(e.getView("south").players.south.handCount).toBe(2);
    expect(e.getView("south").players.south.deckCount).toBe(1);
  });
  test("nonmatching top neither draws nor trashes and stays in deck", () => {
    const e = OnePieceTestEngine.create({
      hand: ["ST22-006", "ST02-012"],
      activeDon: 7,
      deck: ["ST02-002", "OP01-033"],
    });
    const top = e.findCardInZone("south", "deck", "ST02-002");
    e.asSouth().play("ST22-006");
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(top);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
