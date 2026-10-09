import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

import { st05DouglasBullet011 } from "@tcg/op-cards";
describe("ST05-011 Douglas Bullet", () => {
  test.each(["two", "none", "declineTargets"])(
    "DON−4 rests up to2 cost6 and grants Double Attack even when targets=%s",
    (targets) => {
      const e = OnePieceTestEngine.create(
        {
          character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }],
          activeDon: 4,
          restedDon: 4,
        },
        { character: targets === "none" ? [] : ["ST04-004", "ST05-006", "ST04-003"], life: 5 },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const bullet = e.findCardInZone("south", "character", "ST05-011");
      e.asSouth().activateMain(bullet);
      e.asSouth().acceptOptional();
      e.resolveDecision(
        "effectCostReturnDon",
        { selectedIds: ["active-don:0", "active-don:1", "active-don:2", "active-don:3"] },
        "south",
      );
      if (targets !== "none") {
        const king = e.findCardInZone("north", "character", "ST04-004");
        const tesoro = e.findCardInZone("north", "character", "ST05-006");
        const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
        if (step?.kind !== "selectEntity") throw Error("rest");
        expect(step.candidates.map((c) => c.ref.id)).toEqual([king, tesoro]);
        expect(step.max).toBe(2);
        e.resolveDecision(
          "effectTargetSelection",
          { selectedIds: targets === "two" ? [king, tesoro] : [] },
          "south",
        );
        expect(
          e
            .getView("north")
            .players.north.characters.slice(0, 2)
            .map((c) => c?.rested),
        ).toEqual(targets === "two" ? [true, true] : [false, false]);
        expect(e.getView("north").players.north.characters[2]?.rested).toBe(false);
      }
      const repeat = e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: bullet,
        trigger: "activateMain",
      });
      expect(repeat.reason).toBe("This effect has already been used this turn.");
      e.asSouth().attack(bullet, e.leader("north"));
      expect(e.getView("north").players.north.lifeCount).toBe(3);
      e.asSouth().endTurn();
      e.asNorth().endTurn();
      e.asSouth().attack(bullet, e.leader("north"));
      // No usable Counter remains, so the Counter Step ends automatically.
      expect(e.getView("north").players.north.lifeCount).toBe(2);
    },
  );
  test("declining payment keeps DON and gives no Double Attack", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ card: st05DouglasBullet011, playedOnTurn: 0 }], activeDon: 4 },
      { life: 5 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bullet = e.findCardInZone("south", "character", "ST05-011");
    e.asSouth().activateMain(bullet);
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(4);
    e.asSouth().activateMain(bullet);
    e.asSouth().declineOptional();
    e.asSouth().attack(bullet, e.leader("north"));
    expect(e.getView("north").players.north.lifeCount).toBe(4);
  });
});
