import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-010 Namule", () => {
  test("[On Play] revealing an 8000-power Character may K.O. an opposing Character with 2000 base power or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-010", "OP16-004"], activeDon: 5 },
      { character: ["OP01-050"] },
    );
    const targetId = engine.findCardInZone("north", "character", "OP01-050");

    engine.playCard("OP16-010");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Characters above 2000 base power are not eligible", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-010", "OP16-004"], activeDon: 5 },
      { character: ["OP13-013"] },
    );

    engine.playCard("OP16-010");
    engine.acceptLeadingOptional("south");

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP13-013",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal K.O.s nothing", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-010", "OP16-004"], activeDon: 5 },
      { character: ["OP01-050"] },
    );

    engine.playCard("OP16-010");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.north.characters.map((c) => c?.cardId)).toContain(
      "OP01-050",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
