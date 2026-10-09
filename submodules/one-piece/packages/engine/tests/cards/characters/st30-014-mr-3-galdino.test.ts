import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST30-014 Mr.3(Galdino)", () => {
  test.each([
    [1, 1, 0],
    [2, 1, 1],
    [3, 2, 1],
    [4, 2, 2],
  ])("distributes rested pool%s as%s/%s", (pool, a, b) => {
    let e = OnePieceTestEngine.create({
      character: ["ST30-014", "ST30-005", "ST30-013", "ST21-006"],
      restedDon: pool,
      activeDon: 2,
    });
    e.activateEffect(e.findCardInZone("south", "character", "ST30-014"), "activateMain");
    e.asSouth().acceptOptional();
    const first = e.findCardInZone("south", "character", "ST30-005"),
      second = e.findCardInZone("south", "character", "ST30-013");
    const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (p?.kind !== "selectEntity") throw Error("recipients");
    expect(p.candidates.map((c) => c.ref.id)).toEqual([first, second]);
    e.asSouth().chooseTargets(first, second);
    e.resolveDecision("effectGiveDonEachCount", { optionId: String(a) }, "south");
    e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
    e.resolveDecision("effectGiveDonEachCount", { optionId: String(b) }, "south");
    expect(e.getView("south").players.south.characters[1]?.attachedDon).toBe(a);
    expect(e.getView("south").players.south.characters[2]?.attachedDon).toBe(b);
    expect(e.getView("south").players.south.restedDon).toBe(pool - a - b);
    expect(e.getView("south").players.south.activeDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
  test("declines optional self-rest payment", () => {
    const e = OnePieceTestEngine.create({ character: ["ST30-014", "ST30-005"], restedDon: 2 });
    e.activateEffect(e.findCardInZone("south", "character", "ST30-014"), "activateMain");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
  test("zero recipients still pays the rest cost", () => {
    const e = OnePieceTestEngine.create({ character: ["ST30-014", "ST30-005"], restedDon: 2 });
    e.activateEffect(e.findCardInZone("south", "character", "ST30-014"), "activateMain");
    e.asSouth().acceptOptional();
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").players.south.restedDon).toBe(2);
  });
});
