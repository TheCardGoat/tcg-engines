import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("st23-002-shanks", () => {
  test.each(["OP09-001", "ST05-001"])(
    "qualifying Leader %s receives lasting power and opponent base8000 grants discount",
    (leader) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId: leader, hand: ["ST23-002"], activeDon: 6 },
        { character: ["ST15-002"] },
      );
      e.playCard("ST23-002");
      expect(e.getView("south").players.south.activeDon).toBe(0);
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      expect(e.getView("south").players.south.characters[0]?.cost).toBe(9);
      e.asSouth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(7000);
      e.asNorth().endTurn();
      expect(e.getView("south").players.south.leader.power).toBe(5000);
    },
  );
  test("wrong Leader gets no bonus even when Shanks is paid in full", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST23-002"], activeDon: 9 }, {});
    e.playCard("ST23-002");
    expect(e.getView("south").players.south.leader.power).toBe(5000);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("lowering an opposing high-base Character keeps the hand discount", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST23-002", "ST21-017"], activeDon: 10 },
      { character: ["ST15-002"] },
    );
    e.playCard("ST21-017");
    e.asSouth().chooseTargets(e.findCardInZone("north", "character", "ST15-002"));
    expect(e.getView("north").players.north.characters[0]?.power).toBe(3000);
    e.playCard("ST23-002");
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("an own high-base Character cannot supply the opponent-only discount", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST23-002"], activeDon: 6, character: ["ST15-002"] },
      {},
    );
    expect(
      e.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: e.findCardInZone("south", "hand", "ST23-002"),
      }).reason,
    ).toBeTruthy();
    expect(e.getView("south").players.south.activeDon).toBe(6);
  });
});
