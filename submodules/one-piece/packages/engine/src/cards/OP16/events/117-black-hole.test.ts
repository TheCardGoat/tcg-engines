import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-117 Black Hole", () => {
  test("[Main] trashing a [Trigger] card negates an opposing Character's effects", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-117", "OP15-019"], activeDon: 2 },
      { character: ["OP16-003"], activeDon: 5 },
    );
    const newgateId = engine.findCardInZone("north", "character", "OP16-003");

    engine.playCard("OP16-117");
    engine.acceptLeadingOptional("south");
    // The lone [Trigger] card auto-pays the trash cost.
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the negate target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [newgateId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.cardId)).not.toContain("OP15-019");
    expect(south.trash.map((card) => card.cardId)).toContain("OP15-019");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Optional] declined leaves the board unchanged", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-117"], activeDon: 4 }, {});

    engine.playCard("OP16-117");
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

    expect(engine.getView("south").players.south.trash.map((c) => c.cardId)).toContain("OP16-117");
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
