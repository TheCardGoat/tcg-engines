import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-106 Charlotte Smoothie", () => {
  test("FAQ: opponent-turn Life Trigger plays this card without its Your Turn On Play", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", life: ["OP17-106", "EB01-025"], deck: 5, activeDon: 2 },
      { hand: ["EB01-005"] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.map((c) => c?.cardId)).toContain("OP17-106");
    expect(view.players.south.deckCount).toBe(5);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.north.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
  test.each([0, 1])(
    "after paying two DON, adding %i Life still lets the opponent select a hand discard",
    (amount) => {
      let e = OnePieceTestEngine.create(
        { hand: ["OP17-106"], activeDon: 7, deck: ["ST02-002", "ST02-006"] },
        { hand: ["ST02-002", "ST02-006"] },
      );
      const life = e.getView("south").players.south.lifeCount,
        target = e.findCardInZone("north", "hand", "ST02-006");
      e.asSouth().play("OP17-106");
      e.asSouth().acceptOptional();
      e.resolveDecision("effectAddToLifeFromDeck", { optionId: String(amount) }, "south");
      e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
      e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [target] }, "north");
      expect(e.getView("south").players.south.lifeCount).toBe(life + amount);
      expect(e.getView("north").players.north.hand.map((c) => c.cardId)).toEqual(["ST02-002"]);
      expect(e.getView("south").players.south.restedDon).toBe(7);
    },
  );
  test("declining the payable two-DON cost prevents both Life addition and opponent discard", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        hand: ["OP17-106"],
        activeDon: 7,
        deck: ["ST07-003", "ST07-004"],
      },
      { leaderCardId: "ST01-001", hand: ["ST01-004", "ST01-005"] },
    );
    e.asSouth().play("OP17-106");
    const before = e.getView("north");
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = e.getView("south");
    expect(view.players.south.lifeCount).toBe(before.players.south.lifeCount);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.restedDon).toBe(5);
    expect(e.getView("north").players.north.hand).toEqual(before.players.north.hand);
    expect(view.players.north.trash).toEqual(before.players.north.trash);
    expect(view.prompts).toHaveLength(0);
  });

  test.each([0, 1])(
    "with only %i DON remaining after play, neither On Play result occurs",
    (remaining) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST07-001",
          hand: ["OP17-106"],
          activeDon: 5 + remaining,
          deck: ["ST07-003", "ST07-004"],
        },
        { leaderCardId: "ST01-001", hand: ["ST01-004", "ST01-005"] },
      );
      const before = e.getView("north");
      e.asSouth().play("OP17-106");
      const view = e.getView("south");
      expect(view.players.south.lifeCount).toBe(before.players.south.lifeCount);
      expect(view.players.south.deckCount).toBe(2);
      expect(view.players.south.activeDon).toBe(remaining);
      expect(view.players.south.restedDon).toBe(5);
      expect(e.getView("north").players.north.hand).toEqual(before.players.north.hand);
      expect(view.players.north.trash).toEqual(before.players.north.trash);
      expect(view.prompts).toHaveLength(0);
    },
  );
});
