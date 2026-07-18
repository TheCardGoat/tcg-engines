import { describe, expect, test } from "vite-plus/test";
import { eb01Blueno017, eb01Doma005, op09Limejuice014 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-014 Limejuice", () => {
  test("may restrict only a low-power Character that actually has Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op09Limejuice014], activeDon: op09Limejuice014.cost },
      { character: [eb01Blueno017, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const blockerId = engine.findCardInZone("north", "character", eb01Blueno017);
    const vanillaId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op09Limejuice014, "south");

    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(choice?.kind).toBe("selectEntity");
    if (choice?.kind !== "selectEntity") {
      throw new Error("Expected Limejuice's Blocker choice.");
    }
    expect(choice.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    expect(choice.candidates.map((candidate) => candidate.ref.id)).not.toContain(vanillaId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [blockerId] }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
