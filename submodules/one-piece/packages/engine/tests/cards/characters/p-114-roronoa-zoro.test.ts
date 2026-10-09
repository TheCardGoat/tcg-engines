import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-114 Roronoa Zoro", () => {
  test.each([0, 1])("end turn with %s active DON controls whether Zoro can block", (activeDon) => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-114", rested: true }], activeDon },
      { character: [{ cardId: "EB01-018", playedOnTurn: 0 }] },
    );
    const z = e.findCardInZone("south", "character", "P-114");
    e.asSouth().endTurn();
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(activeDon === 0);
    const life = e.getView("south").players.south.lifeCount;
    e.asNorth().attack(e.findCardInZone("north", "character", "EB01-018"), e.leader("south"));
    if (activeDon === 1) {
      e.resolveDecision("battleBlocker", { selectedIds: [z] }, "south");
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(z);
      expect(e.getView("south").players.south.lifeCount).toBe(life);
    } else {
      expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
    }
  });
});
