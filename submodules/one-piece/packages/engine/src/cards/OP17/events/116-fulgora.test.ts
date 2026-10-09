import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-116 Fulgora", () => {
  test("Counter does not grant power without its printed eligibility", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP01-001", hand: ["OP17-116"], character: ["OP17-107"], activeDon: 3 },
      {},
      { activeSeat: "north" },
    );
    const before = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP17-116")] },
      "south",
    );
    expect(e.getView("south").players.south.lifeCount).toBe(before - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("Counter executes the printed power bonus through battle", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP01-001",
        hand: ["OP17-116"],
        character: ["OP17-107", "OP17-107"],
        activeDon: 3,
      },
      {},
      { activeSeat: "north" },
    );
    const lifeBefore = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision(
      "battleCounter",
      { selectedIds: [e.findCardInZone("south", "hand", "OP17-116")] },
      "south",
    );
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-116");
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("[Main] resting 2 DON!! K.O.s an opposing Stage", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-116"], activeDon: 7 },
      { stage: "OP17-057" },
    );

    engine.playCard("OP17-116");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the Stage target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    expect(() => engine.findCardInZone("north", "stage", "OP17-057")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("mentioning Trigger in Chiffon's text does not satisfy the two-Trigger Counter gate", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-116"], character: ["OP17-107", "OP17-105"], activeDon: 1 },
      {},
      { activeSeat: "north" },
    );
    const before = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.asSouth().chooseCounter("OP17-116");
    expect(e.getView("south").players.south.lifeCount).toBe(before - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
