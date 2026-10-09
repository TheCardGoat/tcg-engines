import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-002 Kuina", () => {
  test("self-rest payment rests opposing cost four and excludes cost five", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST12-002"] },
      { character: ["ST12-008", "ST12-013"] },
    );
    const self = e.findCardInZone("south", "character", "ST12-002"),
      target = e.findCardInZone("north", "character", "ST12-008");
    e.activateEffect(self, "activateMain");
    e.asSouth().acceptOptional();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
  });
  test("declines optional self-rest and leaves both Characters active", () => {
    const e = OnePieceTestEngine.create({ character: ["ST12-002"] }, { character: ["ST12-008"] });
    e.activateEffect(e.findCardInZone("south", "character", "ST12-002"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
  test("Life Trigger plays the resolving physical card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST12-002"] },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const id = e.findCardInZone("south", "life", "ST12-002");
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    expect(e.getView("south").players.south.characters[0]?.instanceId).toBe(id);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
