import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-016 Lion Strike", () => {
  test.each(["leader", "character"])("Main rests opposing %s within printed cost limit", (kind) => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST12-016"], activeDon: 2 },
      { character: ["ST12-008", "ST12-013"] },
    );
    e.playCard("ST12-016");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.leader("north"),
      e.findCardInZone("north", "character", "ST12-008"),
    ]);
    e.asSouth().chooseTargets(
      kind === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "ST12-008"),
    );
    expect(
      kind === "leader"
        ? e.getView("north").players.north.leader.rested
        : e.getView("north").players.north.characters[0]?.rested,
    ).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("declines optional Main target after paying Event", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST12-016"], activeDon: 2 },
      { character: ["ST12-008"] },
    );
    e.playCard("ST12-016");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
  test("Counter rests another opposing Character during battle", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST12-016"], activeDon: 2 },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }, "ST12-004"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().chooseCounter(e.findCardInZone("south", "hand", "ST12-016"));
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-004"));
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("Life Trigger activates Main without DON payment", () => {
    const e = OnePieceTestEngine.create(
      { life: ["ST12-016"] },
      { character: [{ cardId: "ST12-008", playedOnTurn: 0 }, "ST12-004"] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(e.findCardInZone("north", "character", "ST12-008"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST12-004"));
    expect(e.getView("north").players.north.characters[1]?.rested).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(0);
  });
});
