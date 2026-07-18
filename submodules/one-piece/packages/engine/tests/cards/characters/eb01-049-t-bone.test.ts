import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb01TBone049 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-049 T-Bone", () => {
  test("maps only opponent Characters with cost 2 or less for its On Play K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01TBone049], activeDon: 5 },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const legalId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb01TBone049);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected T-Bone's low-cost opponent Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([legalId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [legalId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toContain(
      legalId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
