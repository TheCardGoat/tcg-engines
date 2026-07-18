import { describe, expect, test } from "vite-plus/test";
import {
  eb01Blueno017,
  eb01Doma005,
  eb01MountainGod018,
  eb01ScratchmenApoo015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-015 Scratchmen Apoo", () => {
  test("maps and rests an opposing Character at the 2-cost boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01ScratchmenApoo015], activeDon: 1 },
      { character: [eb01Doma005, eb01Blueno017, eb01MountainGod018] },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costTwoId = engine.findCardInZone("north", "character", eb01Blueno017);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb01ScratchmenApoo015);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Apoo's opposing Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId, costTwoId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTwoId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costTwoId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costOneId)?.rested,
    ).toBe(false);
  });
});
