import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-004 Koby", () => {
  test("rests itself and KOs only an opposing cost-two-or-less Character", () => {
    const e = OnePieceTestEngine.create(
      { character: ["ST08-004", "ST08-003"] },
      { character: ["ST08-003", "ST08-011"] },
    );
    const target = e.findCardInZone("north", "character", "ST08-003");
    e.asSouth().activateMain("ST08-004");
    e.asSouth().acceptOptional();
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("KO choice");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.asSouth().chooseTargets(target);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(target);
  });
  test("declines activation without resting or KO", () => {
    const e = OnePieceTestEngine.create({ character: ["ST08-004"] }, { character: ["ST08-003"] });
    e.asSouth().activateMain("ST08-004");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(false);
    expect(e.getView("north").players.north.trash).toHaveLength(0);
    expect(e.getView("north").players.north.characters[0]?.cardId).toBe("ST08-003");
  });
});
