import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST07-009 Charlotte Mont-d'or", () => {
  test("rests and takes bottom Life before KO of opposing cost3 only", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST07-009"], life: ["ST07-002", "ST07-006"] },
      { character: ["ST07-014", "ST07-012"] },
    );
    const card = e.findCardInZone("south", "character", "ST07-009");
    const paid = e.findCardInZone("south", "life", "ST07-006");
    const target = e.findCardInZone("north", "character", "ST07-014");
    e.asSouth().activateMain(card);
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("declines Main payment without resting or moving Life", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST07-009"], life: 2 },
      { character: ["ST07-014"] },
    );
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST07-009"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
  });
  test("Life Trigger pays a hand card to play this physical card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST07-009"], hand: ["ST07-002", "ST07-006"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST07-009");
    const paid = e.findCardInZone("south", "hand", "ST07-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostTrashFromHand", { selectedIds: [paid] }, "south");
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(card);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(paid);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
  });
  test("declines Trigger hand payment and does not play the card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST07-009"], hand: ["ST07-002"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST07-009");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(card);
  });
});
