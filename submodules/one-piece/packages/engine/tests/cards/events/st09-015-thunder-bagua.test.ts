import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST09-015 Thunder Bagua", () => {
  test.each(["top", "bottom"])(
    "Counter protects Leader then adds opposing cost3 Character to %s Life face up",
    (position) => {
      const e = OnePieceTestEngine.create(
        { hand: ["ST09-015"], activeDon: 2, life: 2 },
        { character: [{ card: st04King004, playedOnTurn: 0 }, "ST09-011", "ST09-003"], life: 2 },
        { firstPlayer: "south", activeSeat: "north" },
      );
      const target = e.findCardInZone("north", "character", "ST09-011");
      e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
      e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST09-015"));
      e.asSouth().chooseTargets(e.leader("south"));
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("life target");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
      e.asSouth().chooseTargets(target);
      e.resolveDecision("effectLifePosition", { optionId: position }, "south");
      expect(e.getView("south").players.north.life[position === "top" ? 0 : 2]).toMatchObject({
        instanceId: target,
        hidden: false,
      });
      expect(e.getView("south").players.south.lifeCount).toBe(2);
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    },
  );
  test("three Life still gains Counter power but does not move opponent Character", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST09-015"], activeDon: 2, life: 3 },
      { character: ["ST09-011"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST09-015"));
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger draws one without a Counter target effect", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST09-015"], deck: ["ST09-003", "ST09-006"] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const drawn = e.findCardInZone("south", "deck", "ST09-003");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
