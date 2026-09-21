import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-056 Would You Let Me Eat the Flame-Flame Fruit?", () => {
  test("[Main] draws 2 and a [Lucy] Leader deals 2 damage with +3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP15-002", hand: ["OP15-056", "EB01-005"], activeDon: 7 },
      {},
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;
    const lifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard("OP15-056");

    const south = engine.getView("south").players.south;
    expect(south.hand).toHaveLength(3);
    expect(south.leader?.power).toBe(base + 3000);

    // Double Attack: the Leader deals 2 damage in one attack.
    engine
      .asSouth()
      .attack(engine.getView("south").players.south.leader!.instanceId!, engine.asNorth().leader());
    // Decline the Leader's own optional and let the battle finalize.
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    if (engine.getView("south").prompts.some((p) => p.seat === "north")) {
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    }
    expect(engine.getView("south").players.north.lifeCount).toBe(lifeBefore - 2);
  });

  test("[Main] resolves and moves to trash", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP15-056"], activeDon: 9 }, {});

    engine.playCard("OP15-056");
    const pending = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    if (pending?.extensions?.resolutionIntent) {
      const step = engine.pendingDecision(pending.extensions.resolutionIntent as never, "south")
        .steps[0];
      if (step?.kind === "selectEntity" || step?.kind === "orderItems") {
        engine.resolveDecision(
          pending.extensions.resolutionIntent as never,
          { selectedIds: [] },
          "south",
        );
      } else if (step?.kind === "chooseOption") {
        engine.resolveDecision(
          pending.extensions.resolutionIntent as never,
          { optionId: "0" },
          "south",
        );
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP15-056");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
