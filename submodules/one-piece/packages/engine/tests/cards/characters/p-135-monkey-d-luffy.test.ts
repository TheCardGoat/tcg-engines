import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("p-135-monkey-d-luffy", () => {
  test("OnPlay rests cost5 not6 and later Blocks", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-135"], activeDon: 5 },
      { character: ["P-032", "P-035"] },
    );
    e.asSouth().play("P-135");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-032"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-032"));
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker("P-135");
    expect(e.getView("south").players.south.lifeCount).toBe(4);
    expect(e.getView("south").players.south.trash[0]?.cardId).toBe("P-135");
  });
  test("declines optional rest and Blocker", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-135"], activeDon: 5 },
      { character: ["P-032"] },
    );
    e.asSouth().play("P-135");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
    e.asSouth().endTurn();
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker();
    expect(e.getView("south").players.south.lifeCount).toBe(3);
  });
});
