import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-062-hody-hyouzou", () => {
  test.each([true, false])(
    "rest selection=%s preserves mandatory power and Life clauses",
    (choose) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", character: ["P-062"], life: ["P-042", "ST02-002"] },
        { leaderCardId: "ST01-001", character: ["ST02-002", "ST01-012"] },
      );
      const source = e.findCardInZone("south", "character", "P-062"),
        target = e.findCardInZone("north", "character", "ST02-002");
      e.asSouth().activateMain(source);
      const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
      if (step?.kind !== "selectEntity") throw Error("rest");
      expect(step.candidates.map((c) => c.ref.id)).toEqual([target]);
      e.asSouth().chooseTargets(...(choose ? [target] : []));
      expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
      expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toContain("P-042");
      expect(e.getView("south").players.south.lifeCount).toBe(1);
      expect(e.getView("south").prompts).toHaveLength(0);
      expect(e.getView("north").players.north.characters[0]?.rested).toBe(choose);
      e.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: source,
        trigger: "activateMain",
      });
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(6000);
    },
  );
  test("empty Life still grants power without defeat", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      character: ["P-062"],
      life: 0,
    });
    e.asSouth().activateMain(e.findCardInZone("south", "character", "P-062"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(7000);
    expect(e.getView("south").status).toBe("active");
  });
});
