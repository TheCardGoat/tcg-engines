import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-018 The Power to Destroy the World", () => {
  test("[Main] resting 2 DON!! K.O.s an opposing Stage", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-018"], activeDon: 7 },
      { stage: "OP17-057" },
    );

    engine.playCard("OP17-018");
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

  test("[Counter] with 2+ 8000-base-power Characters saves the Leader with +4000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-018"], character: ["OP16-004", "OP16-005"], activeDon: 5 },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    // Decline the Benn blocker so the counter step is reached.
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    engine.asSouth().chooseCounter("OP17-018");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.getView("south").players.south.leader!.instanceId!] },
      "south",
    );

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("Counter requires base8000 rather than current power raised by another Counter", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["ST01-014", "OP17-018"], character: ["OP16-005", "EB01-025"], activeDon: 2 },
      {},
      { activeSeat: "north" },
    );
    const life = e.getView("south").players.south.lifeCount;
    const target = e.findCardInZone("south", "character", "EB01-025");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    e.asSouth().chooseCounter("ST01-014");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(8000);
    e.asSouth().chooseCounter("OP17-018");
    expect(e.getView("south").players.south.lifeCount).toBe(life - 1);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
