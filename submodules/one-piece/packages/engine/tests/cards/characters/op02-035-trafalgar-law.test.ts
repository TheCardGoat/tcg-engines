import { describe, expect, test } from "vite-plus/test";
import { op02Blenheim012, op02Inuarashi027, op02TrafalgarLaw035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-035 Trafalgar Law", () => {
  test("rests 1 DON!! and returns only itself before playing an exact cost-3 Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Inuarashi027, op02Blenheim012],
      character: [op02TrafalgarLaw035, op02Blenheim012],
      activeDon: 1,
    });
    const lawId = engine.findCardInZone("south", "character", op02TrafalgarLaw035);
    const retainedId = engine.findCardInZone("south", "character", op02Blenheim012);
    const eligibleId = engine.findCardInZone("south", "hand", op02Inuarashi027);
    const wrongCostId = engine.findCardInZone("south", "hand", op02Blenheim012);

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Law's hand-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongCostId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(lawId);
    expect(view.players.south.characters.some((card) => card?.instanceId === retainedId)).toBe(
      true,
    );
    expect(view.players.south.characters.some((card) => card?.instanceId === eligibleId)).toBe(
      true,
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning itself or resting DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op02TrafalgarLaw035],
      activeDon: 1,
    });
    const lawId = engine.findCardInZone("south", "character", op02TrafalgarLaw035);

    engine.activateEffect(lawId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === lawId)).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
