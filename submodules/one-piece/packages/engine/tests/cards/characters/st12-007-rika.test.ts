import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST12-007 Rika", () => {
  test.each([2, 3])("pays two DON before evaluating opponent Life %s", (life) => {
    const e = OnePieceTestEngine.create(
      {
        hand: ["ST12-007"],
        character: [
          { cardId: "ST12-008", rested: true },
          { cardId: "ST12-004", rested: true },
          { cardId: "ST09-005", rested: true },
        ],
        activeDon: 4,
      },
      { life },
    );
    e.playCard("ST12-007");
    e.asSouth().acceptOptional();
    if (life === 3) {
      const p = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (p?.kind !== "selectEntity") throw Error("active");
      const id = e.findCardInZone("south", "character", "ST12-008");
      expect(p.candidates.map((c) => c.ref.id)).toEqual([id]);
      e.asSouth().chooseTargets(id);
    }
    expect(e.getView("south").players.south.restedDon).toBe(4);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(life === 2);
    expect(e.getView("south").players.south.characters[1]?.rested).toBe(true);
  });
  test("declines optional extra DON payment", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST12-007"], character: [{ cardId: "ST12-008", rested: true }], activeDon: 4 },
      { life: 3 },
    );
    e.playCard("ST12-007");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.activeDon).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
  });
});
