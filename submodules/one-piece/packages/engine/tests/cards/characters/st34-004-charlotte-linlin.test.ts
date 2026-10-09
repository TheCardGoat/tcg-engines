import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST34-004 Linlin", () => {
  test.each([0, 1])(
    "saved DON4 then hand cost; Life choice%s still sets base0 while preserving additive power",
    (amount) => {
      let e = OnePieceTestEngine.create(
        {
          hand: ["ST34-004", "ST02-002", "ST02-006"],
          activeDon: 10,
          donDeckCount: 0,
          deck: ["ST02-012", "ST01-006"],
          life: 2,
        },
        { leaderCardId: "ST30-001", character: ["ST30-007"] },
      );
      const paid = e.findCardInZone("south", "hand", "ST02-002"),
        top = e.findCardInZone("south", "deck", "ST02-012"),
        target = e.findCardInZone("north", "character", "ST30-007");
      e.asSouth().play("ST34-004");
      e.asSouth().acceptOptional();
      expect(e.getView("south").players.south.restedDon).toBe(6);
      expect(e.getView("south").players.south.donDeckCount).toBe(4);
      e.pendingDecision("effectCostTrashFromHand", "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
      expect(e.getView("south").players.south.restedDon).toBe(6);
      expect(e.getView("south").players.south.donDeckCount).toBe(4);
      e.resolveDecision("effectAddToLifeFromDeck", { optionId: String(amount) }, "south");
      e.asSouth().chooseTargets(target);
      expect(e.getView("south").players.south.lifeCount).toBe(2 + amount);
      if (amount) expect(e.getState().players.south.life[0]).toBe(top);
      else expect(e.getView("judge").players.south.deckTop?.instanceId).toBe(top);
      expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
      e.asSouth().endTurn();
      expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    },
  );
  test("declines optional compound payment with both costs available", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST34-004", "ST02-002"], activeDon: 10, donDeckCount: 0, life: 2, deck: 10 },
      { character: ["ST30-007"] },
    );
    e.asSouth().play("ST34-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.restedDon).toBe(10);
    expect(e.getView("south").players.south.donDeckCount).toBe(0);
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
  });
  test("no hand card cannot partially pay DON return", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST34-004"], activeDon: 10, donDeckCount: 0 });
    e.asSouth().play("ST34-004");
    expect(e.getView("south").players.south.restedDon).toBe(10);
    expect(e.getView("south").players.south.donDeckCount).toBe(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("FAQ concurrent base6000 setting wins over Linlin zero", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST34-004", "ST02-002"], activeDon: 10, deck: 10 },
      { character: ["OP15-070"] },
    );
    const target = e.findCardInZone("north", "character", "OP15-070");
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    e.asSouth().play("ST34-004");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "0" }, "south");
    e.asSouth().chooseTargets(target);
    expect(e.getView("north").players.north.characters[0]?.power).toBe(6000);
    expect(e.getView("south").players.south.restedDon).toBe(6);
  });
});
