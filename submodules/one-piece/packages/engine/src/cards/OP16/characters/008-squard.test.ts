import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-008 Squard", () => {
  test("[On Play] trashing a 10000 base power Character may K.O. an opposing Character with 8000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-003"], hand: ["OP16-008"], activeDon: 5 },
      { character: ["OP16-004"] },
    );
    const newgateId = engine.findCardInZone("south", "character", "OP16-003");
    const targetId = engine.findCardInZone("north", "character", "OP16-004");

    engine.playCard("OP16-008");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      newgateId,
    );
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without a 10000 base power Character the cost cannot be paid", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP13-013"], hand: ["OP16-008"], activeDon: 5 },
      { character: ["OP16-004"] },
    );

    engine.playCard("OP16-008");

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP16-004",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
