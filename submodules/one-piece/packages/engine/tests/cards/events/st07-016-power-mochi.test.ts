import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST07-016 Power Mochi", () => {
  test("Counter privately moves Life then adds battle power to a Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-016"], activeDon: 1, life: ["ST07-002", "ST07-006"] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const top = e.findCardInZone("south", "life", "ST07-002");
    const event = e.findCardInZone("south", "hand", "ST07-016");
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter(event);
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "self" }, "south");
    expect(e.pendingDecision("effectLookAtLifePosition", "south").message).toContain(
      "Charlotte Anana",
    );
    expect(e.getView("north").decisions).toHaveLength(0);
    e.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    e.asSouth().chooseTargets(e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("judge").players.south.life.at(-1)?.instanceId).toBe(top);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("skipping the look still protects a Character during battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST07-016"], character: [{ card: st04King004, rested: true }], activeDon: 1 },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "character", "ST04-004");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), target);
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST07-016"));
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "skip" }, "south");
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(target);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
  });
  test("Life Trigger draws before privately moving opposing Life", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST07-016"], deck: ["ST07-002", "ST07-006"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }], life: ["ST07-014", "ST07-012"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const drawn = e.findCardInZone("south", "deck", "ST07-002");
    const top = e.findCardInZone("north", "life", "ST07-014");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(drawn);
    e.resolveDecision("effectLookAtLifeOwner", { optionId: "opponent" }, "south");
    e.resolveDecision("effectLookAtLifePosition", { optionId: "bottom" }, "south");
    expect(e.getView("judge").players.north.life.at(-1)?.instanceId).toBe(top);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
