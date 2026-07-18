import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op06Kuzan045 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-045 Kuzan", () => {
  test("draws two and places two chosen physical hand cards at deck bottom in order", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op06Kuzan045, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op06Kuzan045.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op06Kuzan045, "south");
    const selection = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Kuzan's hand selection.");
    expect(selection).toMatchObject({ min: 2, max: 2 });
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toContain(keptId);
    const selectedIds = selection.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    engine.resolveDecision("effectTargetSelection", { selectedIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand).toHaveLength(1);
    expect(engine.getState().players.south.deck.slice(-2)).toEqual(selectedIds);
    expect(view.prompts).toHaveLength(0);
  });
});
