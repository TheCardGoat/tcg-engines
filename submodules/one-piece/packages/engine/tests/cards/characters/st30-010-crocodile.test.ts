import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-010-crocodile", () => {
  test("OnPlay freezes only selected rested Character for next Refresh", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST30-010"], activeDon: 6 },
      { character: [{ cardId: "ST21-005", rested: true }, "ST21-006"] },
    );
    e.playCard("ST30-010");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("freeze");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-005"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    e.asNorth().attack(e.leader("north"), e.leader("south"));
    e.asSouth().chooseBlocker(e.findCardInZone("south", "character", "ST30-010"));
    expect(e.getView("south").players.south.lifeCount).toBe(4);
  });
  test("declines optional freeze target and it refreshes normally", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST30-010"], activeDon: 6 },
      { character: [{ cardId: "ST21-005", rested: true }] },
    );
    e.playCard("ST30-010");
    e.asSouth().chooseNoTargets();
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(false);
  });
});
