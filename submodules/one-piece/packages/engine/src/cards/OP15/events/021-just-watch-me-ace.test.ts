import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-021 Just Watch Me, Ace!!", () => {
  test("costs -3 in hand with 4 or more Events in trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: ["OP15-021"],
        trash: ["EB01-010", "EB01-039", "EB01-050", "OP15-019"],
        activeDon: 1,
      },
      { character: ["OP13-013"] },
    );

    const higumaId = engine.findCardInZone("north", "character", "OP13-013");

    // Cost 4, reduced to 1 with four Events in the trash.
    engine.playCard("OP15-021");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the power target.");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [higumaId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === higumaId)
        ?.power,
    ).toBe(0);
  });

  test("without 4 Events in trash the full cost is due", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP15-021"], trash: ["EB01-010", "EB01-039"], activeDon: 1 },
      {},
    );

    expect(() => engine.playCard("OP15-021")).toThrow();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
  });
});
