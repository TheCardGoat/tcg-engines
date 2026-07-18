import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01TonyTonyChopper015,
  op08DrHiriluk016,
  op08HikingBear010,
  op08TonyTonyChopper001,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-001 Tony Tony.Chopper", () => {
  test("maps Animal-or-Drum Kingdom targets and gives one rested DON!! to each", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op08TonyTonyChopper001,
      character: [op01TonyTonyChopper015, op08DrHiriluk016, op08HikingBear010, eb01Doma005],
      restedDon: 3,
    });
    const animalId = engine.findCardInZone("south", "character", op01TonyTonyChopper015);
    const drumKingdomId = engine.findCardInZone("south", "character", op08DrHiriluk016);
    const bothTypesId = engine.findCardInZone("south", "character", op08HikingBear010);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");

    const targets = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(targets?.kind).toBe("selectEntity");
    if (targets?.kind !== "selectEntity") throw new Error("Expected Chopper's Character choice.");
    expect(targets).toMatchObject({ min: 0, max: 3 });
    expect(targets.candidates.map((candidate) => candidate.ref.id)).toEqual([
      animalId,
      drumKingdomId,
      bothTypesId,
    ]);
    expect(targets.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [animalId, drumKingdomId, bothTypesId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south.lifeCount).toBe(4);
    expect(view.players.south.restedDon).toBe(0);
    for (const instanceId of [animalId, drumKingdomId, bothTypesId]) {
      expect(
        view.players.south.characters.find((card) => card?.instanceId === instanceId)?.attachedDon,
      ).toBe(1);
    }
    expect(
      view.players.south.characters.find((card) => card?.instanceId === excludedId)?.attachedDon,
    ).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
