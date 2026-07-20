import { eb01Doma005 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02KoalaPirateFoil069 } from "../../../../../cards/src/cards/PRB02/characters/069-koala-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-069 Koala", () => {
  test("once per turn gives one rested DON!! to a selected own Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02KoalaPirateFoil069, eb01Doma005], restedDon: 1 },
      { character: [eb01Doma005] },
    );
    const koalaId = engine.findCardInZone("south", "character", prb02KoalaPirateFoil069);
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(koalaId, "activateMain", "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected Koala's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Koala's DON!! target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), koalaId, recipientId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(opposingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(0);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: koalaId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero and leave the rested DON!! unattached", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02KoalaPirateFoil069],
      restedDon: 1,
    });
    const koalaId = engine.findCardInZone("south", "character", prb02KoalaPirateFoil069);

    engine.activateEffect(koalaId, "activateMain", "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === koalaId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
