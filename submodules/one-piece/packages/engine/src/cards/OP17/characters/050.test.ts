import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../../index.ts";

// Auto-verified: Streusen (OP17-050) cost=1 power=2000 counter=0
describe("OP17-050 Streusen", () => {
  test("[On Play] resolves its play effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-050"], activeDon: 3 },
      { character: ["OP13-013"], activeDon: 5 },
    );

    engine.playCard("OP17-050");
    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    if (order?.kind !== "orderItems") throw new Error("Expected two-card deck order");
    expect(order.candidates).toHaveLength(2);
    engine.resolveDecision(
      "effectRearrangeDeckOrder",
      { selectedIds: order.candidates.map((c) => c.ref.id) },
      "south",
    );
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "top" }, "south");
    expect(engine.getView("south").players.south.hand).toHaveLength(1);

    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-050",
    );
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP17-050", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP17-050",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test.each(["top", "bottom"])("orders two physical cards at %s before drawing", (position) => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-050"], deck: ["EB01-005", "EB01-025", "EB01-018", "OP13-013"], activeDon: 1 },
      {},
    );
    const before = [...e.getState().players.south.deck];
    e.playCard("OP17-050");
    e.resolveDecision(
      "effectRearrangeDeckOrder",
      { selectedIds: [before[1]!, before[0]!] },
      "south",
    );
    e.resolveDecision("effectRearrangeDeckPosition", { optionId: position }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toEqual([
      position === "top" ? before[1] : before[2],
    ]);
    expect(e.getState().players.south.deck).toEqual(
      position === "top" ? [before[0], before[2], before[3]] : [before[3], before[1], before[0]],
    );
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
