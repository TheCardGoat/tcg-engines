import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-115-boa-hancock", () => {
  test.each(["leader", "character"])("OnPlay gives rested DON to own %s", (zone) => {
    const e = OnePieceTestEngine.create({ hand: ["P-115"], activeDon: 6, character: ["P-015"] });
    e.asSouth().play("P-115");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.asSouth().chooseTargets(
      zone === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "P-015"),
    );
    expect(
      zone === "leader"
        ? e.getView("south").players.south.leader.attachedDon
        : e.getView("south").players.south.characters[0]?.attachedDon,
    ).toBe(1);
  });
  test("Life Trigger filters yellow Trigger Character power5000 or less", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-115", "P-012", "P-015", "P-016"], hand: ["P-155", "ST02-010", "P-106", "P-034"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectPlaySelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("play");
    expect(p.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toEqual([
      e.findCardInZone("south", "hand", "P-155"),
    ]);
    e.asSouth().choosePlay("P-155");
    expect(e.getView("south").players.south.characters[0]?.cardId).toBe("P-155");
  });
  test("declines optional OnPlay DON", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-115"], activeDon: 6 });
    e.asSouth().play("P-115");
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(6);
  });
  test("declines optional Life Trigger play with legal card", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-115", "P-012", "P-015", "P-016"], hand: ["P-155"] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseCounter();
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseNoPlay();
    expect(e.getView("south").players.south.handCount).toBe(1);
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
  });
});
