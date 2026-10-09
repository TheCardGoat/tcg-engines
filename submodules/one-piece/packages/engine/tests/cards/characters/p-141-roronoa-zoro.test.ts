import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("P-141", () => {
  test.each(["leader", "character"] as const)(
    "On Play lowers an opponent %s and Rush attacks immediately",
    (zone) => {
      const e = OnePieceTestEngine.create(
        { hand: ["P-141"], activeDon: 7 },
        { character: ["EB01-025"] },
      );
      e.playCard("P-141");
      const target =
        zone === "leader" ? e.leader("north") : e.findCardInZone("north", "character", "EB01-025");
      e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
      expect(
        zone === "leader"
          ? e.getView("south").players.north.leader.power
          : e.getView("south").players.north.characters[0]?.power,
      ).toBe(4000);
      e.asSouth().attack("P-141", e.leader("north"));
      expect(e.getView("south").players.north.lifeCount).toBe(3);
      e.endTurn("south");
      expect(
        zone === "leader"
          ? e.getView("south").players.north.leader.power
          : e.getView("south").players.north.characters[0]?.power,
      ).toBe(5000);
    },
  );
  test("may skip the debuff while retaining Rush", () => {
    const e = OnePieceTestEngine.create({ hand: ["P-141"], activeDon: 7 });
    e.playCard("P-141");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    e.asSouth().attack("P-141", e.leader("north"));
    expect(e.getView("south").players.north.leader.power).toBe(5000);
    expect(e.getView("south").players.north.lifeCount).toBe(3);
  });
});
