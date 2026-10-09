import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st07CharlotteSnack004 } from "@tcg/op-cards";
describe("ST07-004 Charlotte Snack", () => {
  test("pays bottom Life for battle power and Banish that prevents a Life Trigger", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ card: st07CharlotteSnack004, playedOnTurn: 0 }],
        activeDon: 1,
        life: ["ST07-002", "ST07-006"],
      },
      { life: ["ST05-009"], hand: ["ST07-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const snack = e.findCardInZone("south", "character", "ST07-004");
    const paid = e.findCardInZone("south", "life", "ST07-006");
    const banished = e.findCardInZone("north", "life", "ST05-009");
    e.asSouth().attachDon(snack, 1);
    e.asSouth().attack(snack, e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    expect(e.getView("south").players.south.characters[0]?.power).toBe(8000);
    e.asNorth().chooseCounter();
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(banished);
    expect(e.getView("north").players.north.hand).toHaveLength(1);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("declines Life payment and deals ordinary damage without bonus power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st07CharlotteSnack004, playedOnTurn: 0 }], activeDon: 1, life: 2 },
      { life: ["ST07-002"], hand: ["ST07-006"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const snack = e.findCardInZone("south", "character", "ST07-004");
    e.asSouth().attachDon(snack, 1);
    e.asSouth().attack(snack, e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    e.asNorth().chooseCounter();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("north").players.north.hand).toHaveLength(2);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("without attached DON the attack does not offer or pay the Life cost", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st07CharlotteSnack004, playedOnTurn: 0 }], life: 2, deck: 10 },
      { life: ["ST07-002"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST07-004"), e.leader("north"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.deckCount).toBe(10);
    expect(e.getView("north").players.north.hand).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
