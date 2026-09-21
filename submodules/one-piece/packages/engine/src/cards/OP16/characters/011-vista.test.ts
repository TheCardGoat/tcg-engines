import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-011 Vista", () => {
  test("[On Play] revealing an 8000-power Character draws 1 card", () => {
    const engine = OnePieceTestEngine.create({ hand: ["OP16-011", "OP16-004"], activeDon: 6 }, {});

    engine.playCard("OP16-011");
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[DON!! x1] [When Attacking] may K.O. up to 2 opposing Characters with 2000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP16-011", attachedDon: 1 }], activeDon: 5 },
      { character: ["OP01-050", "EB03-021"] },
    );
    const penguinId = engine.findCardInZone("north", "character", "OP01-050");
    const alvidaId = engine.findCardInZone("north", "character", "EB03-021");

    engine.asSouth().attack("OP16-011", engine.asNorth().leader());
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. targets.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [penguinId, alvidaId] },
      "south",
    );

    const northTrash = engine.getView("south").players.north.trash.map((card) => card.instanceId);
    expect(northTrash).toContain(penguinId);
    expect(northTrash).toContain(alvidaId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("without an attached DON!! the When Attacking K.O. does not trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: ["OP16-011"], activeDon: 5 },
      { character: ["OP01-050", "EB03-021"] },
    );
    const penguinId = engine.findCardInZone("north", "character", "OP01-050");

    engine.asSouth().attack("OP16-011", engine.asNorth().leader());

    expect(engine.getView("south").players.north.characters.map((c) => c?.instanceId)).toContain(
      penguinId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
