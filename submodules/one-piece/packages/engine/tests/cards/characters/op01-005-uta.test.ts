import { describe, expect, test } from "vite-plus/test";
import { op01Otama006, op01Uta005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-005 Uta", () => {
  test("returns only a low-cost red non-Uta Character from trash to hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01Uta005],
      trash: [op01Otama006, op01Uta005],
      activeDon: op01Uta005.cost,
    });
    const otamaId = engine.findCardInZone("south", "trash", op01Otama006);
    const excludedUtaId = engine.findCardInZone("south", "trash", op01Uta005);

    engine.playCard(op01Uta005, "south");
    const returnCharacter = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(returnCharacter?.kind).toBe("selectEntity");
    if (returnCharacter?.kind !== "selectEntity") {
      throw new Error("Expected Uta's trash-to-hand choice.");
    }
    expect(returnCharacter.candidates.map((candidate) => candidate.ref.id)).toEqual([otamaId]);
    expect(returnCharacter.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      excludedUtaId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [otamaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(otamaId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(excludedUtaId);
    expect(view.prompts).toHaveLength(0);
  });
});
