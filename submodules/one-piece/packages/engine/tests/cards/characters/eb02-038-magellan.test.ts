import { describe, expect, test } from "vite-plus/test";
import { eb02Magellan038, op02Blugori084, op02Domino081 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-038 Magellan", () => {
  test("plays an up-to-cost-2 Character whose compound type includes Impel Down", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb02Magellan038, op02Blugori084, op02Domino081],
      activeDon: 3,
    });
    const compoundTraitId = engine.findCardInZone("south", "hand", op02Blugori084);
    const exactTraitId = engine.findCardInZone("south", "hand", op02Domino081);

    engine.playCard(eb02Magellan038, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity")
      throw new Error("Expected Magellan's Impel Down play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([
      compoundTraitId,
      exactTraitId,
    ]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [compoundTraitId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === compoundTraitId),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
