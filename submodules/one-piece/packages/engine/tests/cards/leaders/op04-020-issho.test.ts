import { describe, expect, test } from "vite-plus/test";
import { eb01LittleoarsJr008, eb01MountainGod018, op04Issho020 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-020 Issho", () => {
  test("applies the attached-DON!! cost reduction and maps its end-turn payment and target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op04Issho020,
        character: [
          { card: eb01MountainGod018, rested: true },
          { card: eb01LittleoarsJr008, rested: true },
        ],
        activeDon: 2,
      },
      { character: [eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const costlyId = engine.findCardInZone("south", "character", eb01LittleoarsJr008);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.attachDon(engine.leader("south"), 1, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === opposingId)?.cost,
    ).toBe(4);

    engine.endTurn("south");

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") {
      throw new Error("Expected Issho's controller to choose a low-cost Character.");
    }
    expect(step).toMatchObject({ min: 0, max: 1 });
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(costlyId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    const characters = new Map(
      view.players.south.characters.flatMap((card) =>
        card ? [[card.instanceId, card.rested] as const] : [],
      ),
    );
    expect(characters.get(eligibleId)).toBe(false);
    expect(characters.get(costlyId)).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(view.activeSeat).toBe("north");
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
