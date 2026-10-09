import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST04-008 Jack", () => {
  test.each([0, 2])(
    "pays a hand card before optionally adding active DON, deck=%s",
    (donDeckCount) => {
      const e = OnePieceTestEngine.create({
        hand: ["ST04-008", "ST04-007", "ST04-009"],
        activeDon: 3,
        donDeckCount,
      });
      const trash = e.findCardInZone("south", "hand", "ST04-007");
      e.asSouth().play("ST04-008");
      e.asSouth().acceptOptional();
      e.resolveDecision("effectCostTrashFromHand", { selectedIds: [trash] }, "south");
      if (donDeckCount) e.asSouth().chooseAddDon(1);
      expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(trash);
      expect(e.getView("south").players.south.activeDon).toBe(donDeckCount ? 1 : 0);
    },
  );
  test("decline keeps the hand payment", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST04-008", "ST04-007"], activeDon: 3 });
    e.asSouth().play("ST04-008");
    e.asSouth().declineOptional();
    expect(e.getView("south").players.south.hand).toHaveLength(1);
    expect(e.getView("south").players.south.activeDon).toBe(0);
  });
  test("can play with no other hand card without activating On Play", () => {
    const e = OnePieceTestEngine.create({ hand: ["ST04-008"], activeDon: 3 });
    e.asSouth().play("ST04-008");
    expect(e.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
