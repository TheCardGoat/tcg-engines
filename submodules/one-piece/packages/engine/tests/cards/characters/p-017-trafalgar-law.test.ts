import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-017-trafalgar-law", () => {
  test("On Play selects opposing Character only and reduces power until turn end", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-017"], activeDon: 4 },
      { character: ["P-012"] },
    );
    e.playCard("P-017");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("target");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "P-012"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "P-012"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.asSouth().endTurn();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
  });
  test("declines optional reduction with legal target", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["P-017"], activeDon: 4 },
      { character: ["P-012"] },
    );
    e.playCard("P-017");
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.restedDon).toBe(4);
  });
});
