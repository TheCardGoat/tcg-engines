import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st07CharlotteLinlin010, st04King004 } from "@tcg/op-cards";
describe("ST07-013", () => {
  test.each(["leader", "character"])(
    "rests to grant Double Attack to a Charlotte Linlin %s",
    (kind) => {
      const e = OnePieceTestEngine.create(
        {
          leaderCardId: "ST07-001",
          character: ["ST07-013", { card: st07CharlotteLinlin010, playedOnTurn: 0 }, "ST07-014"],
        },
        { life: ["ST07-002", "ST07-006", "ST07-012"] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const source = e.findCardInZone("south", "character", "ST07-013");
      const char = e.findCardInZone("south", "character", "ST07-010");
      e.asSouth().activateMain(source);
      e.asSouth().acceptOptional();
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("name choice");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([e.leader("south"), char]);
      e.asSouth().chooseTargets(kind === "leader" ? e.leader("south") : char);
      expect(
        e.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.rested,
      ).toBe(true);
      e.asSouth().attack(kind === "leader" ? e.leader("south") : char, e.leader("north"));
      expect(e.getView("north").players.north.lifeCount).toBe(1);
      expect(e.getView("north").players.north.hand).toHaveLength(2);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      const handBefore = e.getView("north").players.north.hand.length;
      const lifeBefore = e.getView("north").players.north.lifeCount;
      const trashBefore = e.getView("north").players.north.trash.length;
      e.asSouth().attack(kind === "leader" ? e.leader("south") : char, e.leader("north"));
      e.asNorth().chooseCounter();
      expect(e.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
      expect(e.getView("north").players.north.hand).toHaveLength(handBefore + 1);
      expect(e.getView("north").players.north.trash).toHaveLength(trashBefore);
    },
  );
  test("declines rest payment and keeps source active", () => {
    const e = OnePieceTestEngine.create({ leaderCardId: "ST07-001", character: ["ST07-013"] });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "ST07-013"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.lifeCount).toBe(5);
  });
  test("Life Trigger plays this physical card active", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST07-013"] },
      { character: [{ card: st04King004, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const card = e.findCardInZone("south", "life", "ST07-013");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST04-004"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(card);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.hand).toHaveLength(0);
    expect(e.getView("south").players.south.lifeCount).toBe(0);
  });
});
