import { describe, expect, test } from "vite-plus/test";
import { op11Tashigi007 } from "@tcg/op-cards";
import { op11Ain002 } from "../../../../../cards/src/cards/OP11/characters/002-ain.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-002 Ain", () => {
  test("gives an opponent −1000 power, then K.O.s that now-0-power Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11Ain002], activeDon: op11Ain002.cost },
      { character: [op11Tashigi007] },
    );
    const tashigiId = engine.findCardInZone("north", "character", op11Tashigi007);

    engine.playCard(op11Ain002, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (ko?.kind !== "selectEntity") throw new Error("Expected Ain's 0-power K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toContain(tashigiId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [tashigiId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(tashigiId);
    expect(view.prompts).toHaveLength(0);
  });
});
