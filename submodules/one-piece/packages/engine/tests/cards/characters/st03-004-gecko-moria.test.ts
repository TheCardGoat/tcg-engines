import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08GeckoMoriaSp004,
  op09Perona034,
  prb01TrafalgarLawSt03008JollyRogerFoil008,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST03-004 Gecko Moria", () => {
  test("returns a low-cost Character of either printed trait other than Gecko Moria", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op08GeckoMoriaSp004],
      trash: [
        op09Perona034,
        prb01TrafalgarLawSt03008JollyRogerFoil008,
        op08GeckoMoriaSp004,
        eb01Doma005,
      ],
      activeDon: op08GeckoMoriaSp004.cost,
    });
    const thrillerBarkId = engine.findCardInZone("south", "trash", op09Perona034);
    const warlordId = engine.findCardInZone(
      "south",
      "trash",
      prb01TrafalgarLawSt03008JollyRogerFoil008,
    );
    const excludedMoriaId = engine.findCardInZone("south", "trash", op08GeckoMoriaSp004);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op08GeckoMoriaSp004, "south");

    const choice = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(choice).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (choice?.kind !== "selectEntity") throw new Error("Expected Moria's trash choice.");
    const candidates = choice.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual(expect.arrayContaining([thrillerBarkId, warlordId]));
    expect(candidates).not.toContain(excludedMoriaId);
    expect(candidates).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [thrillerBarkId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(thrillerBarkId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([warlordId, excludedMoriaId, wrongTraitId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
