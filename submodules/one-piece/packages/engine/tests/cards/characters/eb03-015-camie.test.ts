import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb01Shirahoshi057,
  eb03Camie015,
  op06HodyJones020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-015 Camie", () => {
  test("maps either Fish-Man or Merfolk DON!! recipients before resting a low-cost opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op06HodyJones020,
        character: [eb03Camie015, eb01Shirahoshi057, eb01Doma005],
        restedDon: 1,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const camieId = engine.findCardInZone("south", "character", eb03Camie015);
    const merfolkId = engine.findCardInZone("south", "character", eb01Shirahoshi057);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(camieId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Camie's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), camieId, merfolkId]),
    );
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [merfolkId] }, "south");

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest?.kind).toBe("selectEntity");
    if (rest?.kind !== "selectEntity") throw new Error("Expected Camie's opposing Character.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([lowCostId]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === camieId)?.rested).toBe(
      true,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === merfolkId)?.attachedDon,
    ).toBe(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
