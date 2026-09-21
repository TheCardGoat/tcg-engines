import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-006 Shanks", () => {
  test("[On Play] resting 2 DON!! may K.O. an opposing Character with 4000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-006"], activeDon: 8 },
      { character: ["OP13-013"] },
    );
    const targetId = engine.findCardInZone("north", "character", "OP13-013");

    engine.playCard("OP16-006");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.activeDon).toBe(2);
    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining rests no DON!! and K.O.s nothing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-006"], activeDon: 8 },
      { character: ["OP13-013"] },
    );

    engine.playCard("OP16-006");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(4);
    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP13-013",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
