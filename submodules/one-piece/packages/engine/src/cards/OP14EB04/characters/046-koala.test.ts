import { eb01Doma005, op06HodyJones020, op11Shirahoshi030 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Koala046 } from "../../../../../cards/src/cards/OP14EB04/characters/046-koala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-046 Koala", () => {
  test("may trash itself to give one included Fish-Man or Merfolk Leader or Character plus 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06HodyJones020,
      character: [op14eb04Koala046, op11Shirahoshi030, eb01Doma005],
    });
    const koalaId = engine.findCardInZone("south", "character", op14eb04Koala046);
    const merfolkId = engine.findCardInZone("south", "character", op11Shirahoshi030);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(koalaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Koala's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), merfolkId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [merfolkId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(koalaId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === merfolkId)?.power,
    ).toBe((op11Shirahoshi030.power ?? 0) + 2000);
    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === merfolkId)?.power,
    ).toBe(op11Shirahoshi030.power);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself or changing a candidate's power", () => {
    const engine = OnePieceTestEngine.create({
      character: [op14eb04Koala046, op11Shirahoshi030],
    });
    const koalaId = engine.findCardInZone("south", "character", op14eb04Koala046);
    const candidateId = engine.findCardInZone("south", "character", op11Shirahoshi030);

    engine.activateEffect(koalaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(koalaId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === candidateId)?.power,
    ).toBe(op11Shirahoshi030.power);
    expect(view.prompts).toHaveLength(0);
  });
});
