import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("characters/st30-012-monkey-d-luffy", () => {
  test("paid Rush rests opposing Blocker before block selection", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST30-012"], activeDon: 5 },
      { character: ["ST21-007", "ST21-005"] },
    );
    e.playCard("ST30-012");
    e.asSouth().acceptOptional();
    e.asSouth().attack(e.findCardInZone("south", "character", "ST30-012"), e.leader("north"));
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("rest");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([
      e.findCardInZone("north", "character", "ST21-007"),
    ]);
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST21-007"));
    expect(e.getView("north").players.north.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.lifeCount).toBe(3);
  });
  test("declines optional Rush payment and cannot attack immediately", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST30-012"], activeDon: 5 });
    e.playCard("ST30-012");
    e.asSouth().declineOptional();
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: e.findCardInZone("south", "character", "ST30-012"),
        targetId: e.leader("north"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.activeDon).toBe(1);
  });
});
