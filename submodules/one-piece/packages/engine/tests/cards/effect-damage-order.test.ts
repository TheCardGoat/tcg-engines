import { describe, expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("effect damage ordering", () => {
  test("resolves a Life Trigger before continuing multi-damage (synthetic amount boundary)", () => {
    // Current printed effect-damage cards deal one damage; the engine amount accepts two.
    const source = getCard("OP06-116");
    const original = source.effects;
    source.effects = {
      effects: [
        { trigger: "main", actions: [{ action: "dealDamage", player: "opponent", amount: 2 }] },
      ],
    };
    try {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP06-116"], activeDon: 6 },
        { life: ["OP02-089", "EB01-005"], hand: 0 },
      );
      engine.playCard("OP06-116");
      expect(engine.getView("north").players.north.lifeCount).toBe(1);
      expect(engine.getView("north").players.north.handCount).toBe(0);
      engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
      // Judgment of Hell's Trigger returns one opposing DON!! before the next damage.
      const returns = engine.pendingDecision("effectOpponentReturnDon", "south").steps[0];
      if (returns?.kind !== "payCost") throw new Error("Expected the DON!! return choice.");
      expect(engine.getView("north").players.north.lifeCount).toBe(1);
      engine.resolveDecision(
        "effectOpponentReturnDon",
        { selectedIds: returns.candidates.slice(0, 1).map((candidate) => candidate.ref.id) },
        "south",
      );
      expect(engine.getView("north").players.north.lifeCount).toBe(0);
      expect(engine.getView("north").players.north.handCount).toBe(1);
      const south = engine.getView("south").players.south;
      expect(south.activeDon + south.restedDon).toBe(5);
      expect(engine.getView("south").prompts).toHaveLength(0);
    } finally {
      source.effects = original;
    }
  });

  test("Ace draws for effect damage after the Life Trigger resolves", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP06-116"], activeDon: 4 },
      { leaderCardId: "OP13-002", life: ["OP06-116"], activeDon: 1 },
      { activeSeat: "north" },
    );
    engine.asNorth().attachDon(engine.leader("north"), 1);
    engine.endTurn("north");
    const northBefore = engine.getView("north").players.north;
    engine.playCard("OP06-116");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    expect(engine.getView("north").players.north.handCount).toBe(northBefore.handCount);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const after = engine.getView("north").players.north;
    expect(after.lifeCount).toBe(0);
    expect(after.handCount).toBe(northBefore.handCount + 2);
    expect(after.deckCount).toBe(northBefore.deckCount - 2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Gaimon reacts after Reject finishes its remaining Life action", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP06-116"], character: ["OP03-043"], activeDon: 4, life: 2 },
      { life: ["EB01-005"] },
    );
    const before = engine.getView("south").players.south;
    engine.playCard("OP06-116");
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
    engine.asSouth().acceptOptional();
    const after = engine.getView("south").players.south;
    expect(after.deckCount).toBe(before.deckCount - 3);
    expect(after.trash.map((card) => card.cardId)).toContain("OP03-043");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
