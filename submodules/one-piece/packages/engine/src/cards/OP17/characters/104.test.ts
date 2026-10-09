import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-104 Charlotte Cracker", () => {
  test("FAQ: opponent-turn Life Trigger plays this card without its Your Turn On Play", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", life: ["OP17-104", "EB01-025"], deck: 5, activeDon: 2 },
      { hand: ["EB01-005"] },
      { activeSeat: "north" },
    );
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.map((c) => c?.cardId)).toContain("OP17-104");
    expect(view.players.south.deckCount).toBe(5);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.north.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
  test("pays two active DON on its own turn to add the top deck card to Life", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        hand: ["OP17-104"],
        activeDon: 5,
        deck: ["ST02-002", "ST02-006"],
      },
      {},
    );
    const life = e.getView("south").players.south.lifeCount;
    e.asSouth().play("OP17-104");
    e.asSouth().acceptOptional();
    e.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(life + 1);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.south.activeDon).toBe(0);
    expect(e.getView("south").players.south.restedDon).toBe(5);
  });
  test("declining a payable On Play cost preserves the two remaining DON and Life", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST07-001",
        hand: ["OP17-104"],
        activeDon: 5,
        deck: ["ST07-003", "ST07-004"],
      },
      {},
    );
    e.asSouth().play("OP17-104");
    const before = e.getView("south").players.south;
    e.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const view = e.getView("south");
    expect(view.players.south.lifeCount).toBe(before.lifeCount);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.players.south.activeDon).toBe(2);
    expect(view.players.south.restedDon).toBe(3);
    expect(view.prompts).toHaveLength(0);
  });

  test("a non-Big-Mom Leader still pays the accepted cost before failing the Life condition", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "ST13-003",
        hand: ["OP17-104"],
        activeDon: 5,
        deck: ["ST13-012", "ST13-013"],
      },
      {},
    );
    const life = e.getView("south").players.south.lifeCount;
    e.asSouth().play("OP17-104");
    e.asSouth().acceptOptional();
    const view = e.getView("south");
    expect(view.players.south.activeDon).toBe(0);
    expect(view.players.south.restedDon).toBe(5);
    expect(view.players.south.lifeCount).toBe(life);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
