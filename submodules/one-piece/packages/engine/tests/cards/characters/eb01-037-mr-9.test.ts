import { describe, expect, test } from "vite-plus/test";
import { eb01Crocus041, eb01Doma005, eb01MountainGod018, eb01Mr9037 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-037 Mr. 9", () => {
  test("pays DON!! -1 to K.O. a mapped low-cost target only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Crocus041, playedOnTurn: 0 },
          eb01Doma005,
        ],
      },
      { character: [eb01Mr9037], hand: [eb01Doma005], activeDon: 2 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const secondAttackerId = engine.findCardInZone("south", "character", eb01Crocus041);
    const lowCostTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(firstAttackerId, engine.leader("north"), "south");

    const ko = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") {
      throw new Error("Expected Mr. 9's low-cost K.O. target choice.");
    }
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([lowCostTargetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostTargetId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    engine.declareAttack(secondAttackerId, engine.leader("north"), "south");
    expect(engine.pendingDecision("battleCounter", "north").steps[0]?.kind).toBe("selectEntity");
    expect(engine.getView("north").players.south.trash.map((card) => card.instanceId)).toContain(
      lowCostTargetId,
    );
    expect(engine.getView("north").players.north.donDeckCount).toBe(donDeckBefore + 1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
