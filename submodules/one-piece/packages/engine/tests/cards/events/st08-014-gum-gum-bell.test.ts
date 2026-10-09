import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-014 Gum-Gum Bell", () => {
  test("pays top Life before reducing an opposing cost by seven until turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-014"], life: ["ST08-003", "ST08-010"], activeDon: 2 },
      { character: ["ST05-011"] },
    );
    const top = e.findCardInZone("south", "life", "ST08-003");
    e.playCard("ST08-014");
    e.asSouth().acceptOptional();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST05-011"));
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(top);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(1);
    expect(e.getView("south").players.south.lifeCount).toBe(1);
    e.endTurn("south");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(8);
  });
  test("declines Life payment after spending the Event", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST08-014"], life: 2, activeDon: 2 },
      { character: ["ST05-011"] },
    );
    e.playCard("ST08-014");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.handCount).toBe(0);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(8);
  });
  test("Trigger returns only a black cost-two-or-less Character from trash", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST08-014"], trash: ["ST08-003", "ST08-011", "ST08-015", "ST02-002"] },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "trash", "ST08-003");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST08-010"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("return choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
});
