import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-020 If You're Coming With Me, Kiss Your Lives Goodbye", () => {
  test("[Main] resting a DON!! and revealing an 8000-power Character draws 1", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-020", "OP16-004", "EB01-005"], activeDon: 5 },
      {},
    );

    engine.playCard("OP16-020");
    engine.acceptLeadingOptional("south");
    // The rest-DON cost and the lone 8000-power reveal auto-resolve.

    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Counter] trashing a hand card saves the Leader with +3000", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-020", "EB01-005"], activeDon: 5 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.endTurn("south");
    engine.asNorth().attack("OP16-003", engine.asSouth().leader());
    engine.asSouth().chooseCounter("OP16-020");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    // The lone hand card auto-pays the trash.

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-020"], activeDon: 3 }, {});

    engine.playCard("OP16-020");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-020");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const you = "OP16-020";
    const engine = OnePieceTestEngine.create({ hand: [you], activeDon: 3 }, {});
    const before = engine.getView("south").players.south;

    engine.playCard(you);
    const gate = engine.getView("south").decisions?.[0] as
      | { extensions?: { resolutionIntent?: string } }
      | undefined;
    const gateIntent = gate?.extensions?.resolutionIntent;
    if (gateIntent === "effectOptional") {
      engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    } else if (gateIntent) {
      const gateStep = engine.pendingDecision(gateIntent as never, "south").steps[0];
      if (gateStep?.kind === "selectEntity" || gateStep?.kind === "orderItems") {
        engine.resolveDecision(gateIntent as never, { selectedIds: [] }, "south");
      } else if (gateStep?.kind === "chooseOption") {
        engine.resolveDecision(gateIntent as never, { optionId: "0" }, "south");
      }
    }

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain(you);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
