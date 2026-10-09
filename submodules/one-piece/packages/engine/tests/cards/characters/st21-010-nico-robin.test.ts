import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST21-010 Nico Robin", () => {
  test("attacking with two DON KOs only opposing power 4000 or less", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-010", attachedDon: 2, playedOnTurn: 0 }] },
      { character: ["ST21-005", "ST21-006"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-010"), e.leader("north"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("targets");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-005"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-005"));
    expect(e.getView("north").players.north.trash[0]?.cardId).toBe("ST21-005");
    expect(e.getView("north").players.north.characters[1]?.cardId).toBe("ST21-006");
  });
  test("declines optional KO target with a legal target", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-010", attachedDon: 2, playedOnTurn: 0 }] },
      { character: ["ST21-005"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-010"), e.leader("north"));
    e.asSouth().chooseNoTargets();
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
  });
  test("one attached DON does not activate KO", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "ST21-010", attachedDon: 1, playedOnTurn: 0 }] },
      { character: ["ST21-005"] },
    );
    e.asSouth().attack(e.findCardInZone("south", "character", "ST21-010"), e.leader("north"));
    expect(e.getView("north").players.north.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
});
