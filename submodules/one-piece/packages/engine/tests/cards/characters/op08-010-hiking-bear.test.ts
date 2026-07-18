import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op08HikingBear010, op08Lapins012 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-010 Hiking Bear", () => {
  test("with DON!! x1 boosts another compound Animal Character once for the turn", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08HikingBear010, op08Lapins012, eb01Doma005],
      activeDon: 1,
    });
    const bearId = engine.findCardInZone("south", "character", op08HikingBear010);
    const animalId = engine.findCardInZone("south", "character", op08Lapins012);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const basePower = op08Lapins012.power ?? 0;
    engine.attachDon(bearId, 1, "south");

    engine.activateEffect(bearId, "activateMain", "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Hiking Bear's Animal target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([animalId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toEqual(
      expect.arrayContaining([bearId, wrongTraitId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [animalId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === animalId)
        ?.power,
    ).toBe(basePower + 1000);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: bearId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === animalId)
        ?.power,
    ).toBe(basePower);
  });

  test("cannot activate without an attached DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op08HikingBear010, op08Lapins012],
    });
    const bearId = engine.findCardInZone("south", "character", op08HikingBear010);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: bearId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
