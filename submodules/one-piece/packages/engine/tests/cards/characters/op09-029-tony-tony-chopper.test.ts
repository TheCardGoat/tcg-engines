import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op09Sanji028,
  op09TonyTonyChopper029,
  op09TrafalgarLaw030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-029 Tony Tony.Chopper", () => {
  test("at end of turn activates only an ODYSSEY Character with cost 4 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op09TonyTonyChopper029, rested: true },
          { card: op09TrafalgarLaw030, rested: true },
          { card: op09Sanji028, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op09TonyTonyChopper029);
    const lawId = engine.findCardInZone("south", "character", op09TrafalgarLaw030);
    const expensiveId = engine.findCardInZone("south", "character", op09Sanji028);
    const wrongTraitId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.endTurn("south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Chopper's active target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([chopperId, lawId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "south");

    const view = engine.getView("north");
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.rested).toBe(
      false,
    );
    expect(
      view.players.south.characters.find((card) => card?.instanceId === chopperId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
