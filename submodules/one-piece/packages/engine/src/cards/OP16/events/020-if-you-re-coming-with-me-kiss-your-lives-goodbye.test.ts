import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-020 If You're Coming With Me, Kiss Your Lives Goodbye", () => {
  test("Main reveals a chosen 8000-power Character before drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: ["OP16-020", "OP16-004", "EB01-041", "EB01-005"],
      activeDon: 2,
    });
    const first = engine.findCardInZone("south", "hand", "OP16-004");
    const second = engine.findCardInZone("south", "hand", "EB01-041");
    const before = engine.getView("south").players.south;
    engine.asSouth().play("OP16-020");
    engine.asSouth().acceptOptional();
    const step = engine.pendingDecision("effectCostRevealFromHand", "south").steps[0];
    if (step?.kind !== "payCost") throw new Error("Expected reveal cost");
    expect(step.candidates.map((c) => c.ref.id)).toEqual([first, second]);
    engine.resolveDecision("effectCostRevealFromHand", { selectedIds: [second] }, "south");
    const after = engine.getView("south").players.south;
    expect(after.hand.some((c) => c.instanceId === second)).toBe(true);
    expect(after.handCount).toBe(before.handCount);
    expect(after.deckCount).toBe(before.deckCount - 1);
    expect(after.restedDon).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Main cannot pay its reveal cost with only a lower-power Character", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-020", "EB01-005"], activeDon: 2 });
    const before = engine.getView("south").players.south;
    engine.asSouth().play("OP16-020");
    const after = engine.getView("south").players.south;
    expect(after.deckCount).toBe(before.deckCount);
    expect(after.activeDon).toBe(2);
    expect(after.handCount).toBe(1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] trashing a hand card saves the Leader with +3000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-020", "EB01-005"], activeDon: 5 },
      { activeDon: 2 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attachDon(engine.leader("north"), 2);
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseCounter("OP16-020");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card auto-pays the trash.
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );
    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toEqual([
      "OP16-020",
      "EB01-005",
    ]);
    expect(engine.getView("south").prompts).toHaveLength(0);

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("Main declines affordable reveal and rest costs without drawing", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-020", "OP16-004"], activeDon: 2 });
    engine.asSouth().play("OP16-020");
    const before = engine.getView("south").players.south;
    engine.asSouth().declineOptional();
    const after = engine.getView("south").players.south;
    expect(after.activeDon).toBe(before.activeDon);
    expect(after.hand).toEqual(before.hand);
    expect(after.deckCount).toBe(before.deckCount);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("paid Event keeps its official name in the public trash", () => {
    const e = OnePieceTestEngine.create({ hand: ["OP16-020"], activeDon: 1 });
    e.playCard("OP16-020");
    expect(e.getView("south").players.south.trash.find((c) => c.cardId === "OP16-020")?.name).toBe(
      "If You're Coming with Me... Kiss Your Lives Goodbye!!",
    );
  });
});
