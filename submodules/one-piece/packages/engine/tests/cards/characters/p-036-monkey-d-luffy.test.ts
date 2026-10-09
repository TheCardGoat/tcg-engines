import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("p-036-monkey-d-luffy", () => {
  test.each(["top", "bottom"])(
    "Life %s payment buffs self and selected Leader through turn",
    (position) => {
      const e = OnePieceTestEngine.create(
        { character: [{ cardId: "P-036", playedOnTurn: 0 }], life: ["P-012", "P-015"] },
        {},
        { firstPlayer: "north", activeSeat: "south" },
      );
      const paid = e.findCardInZone("south", "life", position === "top" ? "P-012" : "P-015");
      e.asSouth().attack("P-036", e.leader("north"));
      e.asSouth().acceptOptional();
      e.resolveDecision("effectCostAddLifeToHand", { optionId: position }, "south");
      e.asSouth().chooseTargets(e.leader("south"));
      expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(paid);
      expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
      expect(e.getView("south").players.south.leader.power).toBe(6000);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    },
  );
  test("declines optional Life cost and keeps both powers unchanged", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-036", playedOnTurn: 0 }], life: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-036", e.leader("north"));
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.lifeCount).toBe(2);
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
  });
  test("declines Leader target but self still gains power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-036", playedOnTurn: 0 }], life: 2 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-036", e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    e.asSouth().chooseNoTargets();
    expect(e.getView("south").players.south.characters[0]?.power).toBe(5000);
    expect(e.getView("south").players.south.leader.power).toBe(5000);
  });
  test("zero Life cannot pay or increase power", () => {
    const e = OnePieceTestEngine.create(
      { character: [{ cardId: "P-036", playedOnTurn: 0 }], life: 0 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack("P-036", e.leader("north"));
    expect(e.getView("south").players.south.characters[0]?.power).toBe(4000);
    expect(e.getView("south").players.south.handCount).toBe(0);
  });
});
