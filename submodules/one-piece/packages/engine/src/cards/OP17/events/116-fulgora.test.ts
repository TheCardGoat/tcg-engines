import { describe, expect, test } from "vite-plus/test";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP17-116 Fulgora", () => {
  test("[Main] resting 2 DON!! K.O.s an opposing Stage", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP17-116"], activeDon: 7 },
      { stage: "OP17-057" },
    );

    engine.playCard("OP17-116");
    engine.acceptLeadingOptional("south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the Stage target.");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [target.candidates[0]!.ref.id] },
      "south",
    );

    expect(() => engine.findCardInZone("north", "stage", "OP17-057")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
