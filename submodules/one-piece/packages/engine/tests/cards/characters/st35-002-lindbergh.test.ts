import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st35-002-lindbergh", () => {
  test("OnPlay lowers one opposing Character by3000 until turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST35-002"], activeDon: 4 },
      { character: ["ST21-005", "ST21-006"] },
    );
    e.playCard("ST35-002");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("power");
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(e.leader("north"));
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(1000);
    expect(e.getView("north").players.north.characters[1]?.power).toBe(5000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
  });
  test("declines optional power reduction with legal target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST35-002"], activeDon: 4 },
      { character: ["ST21-005"] },
    );
    e.playCard("ST35-002");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(4000);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
});
