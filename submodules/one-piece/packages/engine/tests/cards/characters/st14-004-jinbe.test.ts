import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST14-004 Jinbe", () => {
  test("black Straw Hat cost increases through opponent turn then expires", () => {
    const e = OnePieceTestEngine.create({
      character: ["ST14-004", "ST14-005", "ST12-015", "ST08-003"],
    });
    const source = e.findCardInZone("south", "character", "ST14-004"),
      target = e.findCardInZone("south", "character", "ST14-005");
    e.activateEffect(source, "activateMain");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("cost");
    expect(p.candidates.map((c) => c.ref.id)).toContain(target);
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "character", "ST12-015"),
    );
    expect(p.candidates.map((c) => c.ref.id)).not.toContain(
      e.findCardInZone("south", "character", "ST08-003"),
    );
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
    expect(
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: source,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    e.endTurn("south");
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(6);
    e.endTurn("north");
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(4);
  });
  test("declines optional cost increase", () => {
    const e = OnePieceTestEngine.create({ character: ["ST14-004", "ST14-005"] });
    e.activateEffect(e.findCardInZone("south", "character", "ST14-004"), "activateMain");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.characters[1]?.cost).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
  });
});
