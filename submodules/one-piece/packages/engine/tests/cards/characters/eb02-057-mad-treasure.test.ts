import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02MadTreasure057,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-057 Mad Treasure", () => {
  test("pays with bottom Life, maps a cost-3 opposing Character, and places it face-up at bottom Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb02MadTreasure057, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
        life: [eb01Fourtricks025],
        deck: [eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb02MadTreasure057);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const lifeCost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    expect(lifeCost?.kind).toBe("chooseOption");
    if (lifeCost?.kind !== "chooseOption") {
      throw new Error("Expected Mad Treasure's top-or-bottom Life cost.");
    }
    expect(lifeCost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Mad Treasure's opposing Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") {
      throw new Error("Expected Mad Treasure's opposing Life position.");
    }
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      bottomLifeId,
    );
    expect(engine.getState().players.north.life.at(-1)).toBe(eligibleId);
    expect(engine.getState().cards[eligibleId]?.faceUp).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
