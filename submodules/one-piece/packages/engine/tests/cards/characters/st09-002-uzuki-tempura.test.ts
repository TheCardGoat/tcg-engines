import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st04King004 } from "@tcg/op-cards";
describe("ST09-002", () => {
  test("Life Trigger rest filters by cost and then adds this physical card to hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST09-002"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }, "ST07-002", "ST07-006", "ST07-014"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST09-002");
    const target = e.findCardInZone("north", "character", "ST07-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("target");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([
      target,
      e.findCardInZone("north", "character", "ST07-006"),
    ]);
    e.asSouth().chooseTargets(target);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === target)?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(card);
    expect(e.getView("south").players.south.trash).toHaveLength(0);
  });
  test("choosing zero targets still must add the Life Trigger card to hand", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST09-002"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }, "ST07-002"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST09-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets();
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(card);
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(2);
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(false);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
