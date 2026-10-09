import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../src/index.ts";
describe("ST08-001 Monkey.D.Luffy", () => {
  test("two simultaneous Character KOs give two separate rested DON choices", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST08-001",
        hand: ["ST08-005", "ST08-003"],
        character: ["ST08-008"],
        activeDon: 9,
      },
      { character: ["ST08-008"] },
    );
    e.playCard("ST08-005");
    e.asSouth().acceptOptional();
    const order = e.pendingDecision("readyEffectOrder", "south").steps[0];
    if (order?.kind !== "chooseOption") throw Error("Expected two ready Luffy effects");
    expect(order.options).toHaveLength(2);
    e.resolveDecision("readyEffectOrder", { optionId: order.options[0]!.id }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    e.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(2);
    expect(e.getView("south").players.south.restedDon).toBe(7);
    expect(e.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("may choose zero rested DON after a battle KO", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST08-001",
        character: [{ cardId: "ST08-010", playedOnTurn: 0 }],
        restedDon: 1,
      },
      { character: [{ cardId: "ST08-008", rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    e.asSouth().attack(
      e.findCardInZone("south", "character", "ST08-010"),
      e.findCardInZone("north", "character", "ST08-008"),
    );
    e.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(1);
  });
  test("opponent-turn KO does not attach DON", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST08-001", character: [{ cardId: "ST08-008", rested: true }], restedDon: 1 },
      { character: [{ cardId: "ST08-010", playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    e.asNorth().attack(
      e.findCardInZone("north", "character", "ST08-010"),
      e.findCardInZone("south", "character", "ST08-008"),
    );
    expect(e.getView("south").players.south.leader.attachedDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
