import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("recent cards test conditions after paying optional costs", () => {
  test.each([
    { leaderCardId: "OP16-001", activeDon: 10 },
    { leaderCardId: "OP09-001", activeDon: 6 },
  ])(
    "OP16-012 can rest DON even when the later gate is false: %j",
    ({ leaderCardId, activeDon }) => {
      const e = OnePieceTestEngine.create(
        { leaderCardId, activeDon, hand: ["OP16-012", "OP09-004"] },
        {},
      );
      e.asSouth().play("OP16-012");
      e.asSouth().acceptOptional();
      const v = e.getView("south");
      expect(v.players.south.activeDon).toBe(activeDon - 6);
      expect(v.players.south.hand.map((c) => c.cardId)).toEqual(["OP09-004"]);
      expect(v.prompts).toHaveLength(0);
    },
  );
  test("OP16-047 can rest itself with fewer than eight opponent hand cards", () => {
    const e = OnePieceTestEngine.create({ character: ["OP16-047"] }, { hand: 7 });
    e.asSouth().activateMain("OP16-047");
    e.asSouth().acceptOptional();
    const v = e.getView("south");
    expect(v.players.south.characters[0]?.rested).toBe(true);
    expect(v.players.north.handCount).toBe(7);
    expect(v.prompts).toHaveLength(0);
  });
  test("OP17-068 can trash two on attack without adding DON under a different Leader", () => {
    const e = OnePieceTestEngine.create(
      { character: ["OP17-068"], hand: ["EB01-005", "EB01-025"], donDeckCount: 10 },
      {},
    );
    e.asSouth().attack("OP17-068", e.leader("north"));
    e.asSouth().acceptOptional();
    const v = e.getView("south");
    expect(v.players.south.hand).toHaveLength(0);
    expect(v.players.south.trash).toHaveLength(2);
    expect(v.players.south.donDeckCount).toBe(10);
    expect(v.prompts).toHaveLength(0);
  });
  test("OP17-073 can trash a hand card without adding DON under a different Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-073", "EB01-005"], activeDon: 3, donDeckCount: 7 },
      {},
    );
    e.asSouth().play("OP17-073");
    e.asSouth().acceptOptional();
    const v = e.getView("south");
    expect(v.players.south.hand).toHaveLength(0);
    expect(v.players.south.trash.map((c) => c.cardId)).toEqual(["EB01-005"]);
    expect(v.players.south.activeDon).toBe(0);
    expect(v.players.south.donDeckCount).toBe(7);
    expect(v.prompts).toHaveLength(0);
  });
  test("OP17-078 can pay both costs without adding DON under a different Leader", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-078", "EB01-005", "EB01-025"], activeDon: 4, donDeckCount: 6 },
      {},
    );
    e.asSouth().play("OP17-078");
    e.asSouth().acceptOptional();
    const v = e.getView("south");
    expect(v.players.south.hand).toHaveLength(0);
    expect(v.players.south.trash).toHaveLength(3);
    expect(v.players.south.activeDon).toBe(0);
    expect(v.players.south.restedDon).toBe(4);
    expect(v.players.south.donDeckCount).toBe(6);
    expect(v.prompts).toHaveLength(0);
  });
  test.each(["OP16-012", "OP16-047", "OP17-068", "OP17-073", "OP17-078"])(
    "%s can decline the optional cost with a false later condition",
    (cardId) => {
      const fromField = cardId === "OP16-047" || cardId === "OP17-068";
      const e = OnePieceTestEngine.create(
        {
          character: fromField ? [cardId] : [],
          hand: fromField ? ["EB01-005", "EB01-025"] : [cardId, "EB01-005", "EB01-025"],
          activeDon: 10,
        },
        {},
      );
      if (cardId === "OP16-047") e.asSouth().activateMain(cardId);
      else if (cardId === "OP17-068") e.asSouth().attack(cardId, e.leader("north"));
      else e.asSouth().play(cardId);
      const before = e.getView("south").players.south;
      e.asSouth().declineOptional();
      const after = e.getView("south").players.south;
      expect(after.hand.map((c) => c.instanceId)).toEqual(before.hand.map((c) => c.instanceId));
      expect(after.activeDon).toBe(before.activeDon);
      expect(after.restedDon).toBe(before.restedDon);
      expect(after.trash.map((c) => c.instanceId)).toEqual(before.trash.map((c) => c.instanceId));
      expect(e.getView("south").prompts).toHaveLength(0);
    },
  );
});
