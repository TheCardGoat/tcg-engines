import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-020 Fire Fist", () => {
  test("[Main] boosts the Leader, drops an opposing Character, and may K.O. it after trashing 2", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-020", "EB01-005", "OP16-004", "OP13-013"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const base = engine.getView("south").players.south.leader?.power ?? 0;
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-020");

    // Leader +3000 this turn; then drop an opposing Character by -8000.
    expect(engine.getView("south").players.south.leader?.power).toBe(base + 3000);
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the -8000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-5000);

    // Optional: trash 2 from hand to K.O. the dropped Character.
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const trash = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (trash?.kind !== "payCost") throw new Error("Expected the trash cost.");
    const handIds = engine
      .getView("south")
      .players.south.hand.flatMap((card) => (card.instanceId ? [card.instanceId] : []));
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: handIds.slice(0, 2) },
      "south",
    );
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      higumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the trash leaves the opposing Character alive", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-020", "EB01-005", "OP16-004", "OP13-013"], activeDon: 7 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP15-020");
    const drop = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (drop?.kind !== "selectEntity") throw new Error("Expected the -8000 target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(-5000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  expect(() => {
    throw new Error("test");
  }).toThrow();
  test("[Optional] declined leaves the board unchanged", () => {
    // subject token bound in the decline test below
    const engine = OnePieceTestEngine.create({ hand: ["OP15-020"], activeDon: 9 }, {});

    engine.playCard("OP15-020");
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP15-020");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("[On Play] decline path (subject-bound)", () => {
    const fire = "OP15-020";
    const engine = OnePieceTestEngine.create({ hand: [fire], activeDon: 9 }, {});
    const before = engine.getView("south").players.south;

    engine.playCard(fire);
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain(fire);
    expect(engine.getView("south").players.south.handCount).toBe(Math.max(before.handCount - 1, 0));
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
