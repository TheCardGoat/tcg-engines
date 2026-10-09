import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-020-helmeppo", () => {
  test.each(["leader", "character"] as const)("On Play boosts own %s and expires", (zone) => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-020"], activeDon: 1, character: ["P-012"] },
      { character: ["P-015"] },
    );
    e.playCard("P-020");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("power");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(e.leader("north"));
    const id =
      zone === "leader" ? e.leader("south") : e.findCardInZone("south", "character", "P-012");
    e.asSouth().chooseTargets(id);
    expect(
      zone === "leader"
        ? e.getView("south").players.south.leader.power
        : e.getView("south").players.south.characters[0]?.power,
    ).toBe(6000);
    e.asSouth().endTurn();
    expect(
      zone === "leader"
        ? e.getView("south").players.south.leader.power
        : e.getView("south").players.south.characters[0]?.power,
    ).toBe(5000);
  });
  test("declines optional power increase with legal Leader and Characters", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-020"], activeDon: 1 });
    e.playCard("P-020");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(2000);
  });
});
