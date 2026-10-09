import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-113-jewelry-bonney", () => {
  test("two DON gives opponentturn power and actual Blocker", () => {
    const e = OnePieceTestEngine.create({ character: ["P-113"], activeDon: 2 });
    e.attachDon(e.findCardInZone("south", "character", "P-113"), 2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker("P-113");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("one DON cannot Block and adds no opponentturn power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-113", attachedDon: 1 }] },
      {},
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    expect(e.getView("south").players.south.lifeCount).toBe(3);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("Life Trigger KOs cost3 excludes4", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-113", "P-012", "P-015", "P-016"] },
      { character: ["P-012", "P-033"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("KO");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-012"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-012"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("P-012");
  });
  test("declines optional Trigger KO", () => {
    const e = OnePieceTestEngine.create(
      { life: ["P-113", "P-012", "P-015", "P-016"] },
      { character: ["P-012"] },
      { activeSeat: "north", firstPlayer: "south" },
    );
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().activateLifeTrigger();
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("P-012");
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
});
