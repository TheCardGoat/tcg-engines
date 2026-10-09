import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-096 I'm Luffy! The Man Who Will Be King of the Pirates", () => {
  test("[Counter] is gated on a cost-12-or-more Character existing", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP17-096"],
        character: ["OP17-118"],
        activeDon: 5,
      },
      { character: ["OP16-012"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-012", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-096");
    // No cost-12+ Character exists: the gate leaves the +4000 unapplied and
    // the counter auto-declines, so the Leader takes the damage.
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore - 1);
  });

  test("[Counter] resolves as a battle counter", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-096"], activeDon: 5 },
      { activeDon: 5 },
    );

    engine.endTurn("south");
    engine.asNorth().attack(engine.leader("north"), engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP17-096");
    const boost = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (boost?.extensions?.resolutionIntent === "effectTargetSelection") {
      engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP17-096");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("opponent-only cost18 Loki enables the Counter", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP17-096"], activeDon: 1 },
      { character: ["OP17-119"] },
      { activeSeat: "north" },
    );
    const before = e.getView("south").players.south.lifeCount;
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.asSouth().chooseCounter("OP17-096");
    e.resolveDecision("effectTargetSelection", { selectedIds: [e.leader("south")] }, "south");
    expect(e.getView("south").players.south.lifeCount).toBe(before);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
  test("Life Trigger recovers an Elbaph card without the Counter condition", () => {
    const e = OnePieceTestEngine.create(
      { life: ["OP17-096", "EB01-025"], trash: ["OP17-094", "EB01-005"] },
      {},
      { activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "trash", "OP17-094");
    e.declareAttack(e.leader("north"), e.leader("south"), "north");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");
    const choice = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (choice?.kind !== "selectEntity") throw new Error("Expected recovery");
    expect(choice.candidates.map((c) => c.ref.id)).toEqual([target]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(target);
    expect(e.getView("south").prompts).toHaveLength(0);
  });
});
