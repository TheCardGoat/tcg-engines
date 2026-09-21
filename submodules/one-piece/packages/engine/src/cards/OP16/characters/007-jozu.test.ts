import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-007 Jozu", () => {
  test("[On Play] revealing an 8000-power Character may give an opposing Character -1000 this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-007", "OP16-004"], activeDon: 7 },
      { character: ["EB03-021"] },
    );
    const targetId = engine.findCardInZone("north", "character", "EB03-021");

    engine.playCard("OP16-007");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the -1000 power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === targetId)
        ?.power,
    ).toBe(1000);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("declining the reveal leaves power untouched", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP16-007", "OP16-004"], activeDon: 7 },
      { character: ["EB03-021"] },
    );

    engine.playCard("OP16-007");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.flatMap((card) => (card ? [card.power] : [])),
    ).toEqual([2000]);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
