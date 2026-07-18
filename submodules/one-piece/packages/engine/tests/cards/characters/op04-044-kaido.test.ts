import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01DraculeMihawk070,
  op01EustassCaptainKid051,
  op04Kaido044,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-044 Kaido", () => {
  test("returns an up-to-cost-8 and then an up-to-cost-3 Character to each owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op04Kaido044],
        character: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op04Kaido044.cost,
      },
      { character: [op01EustassCaptainKid051, op01DraculeMihawk070, eb01Doma005] },
    );
    const ownCostThreeId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const ownCostFiveId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const opposingCostEightId = engine.findCardInZone(
      "north",
      "character",
      op01EustassCaptainKid051,
    );
    const opposingCostNineId = engine.findCardInZone("north", "character", op01DraculeMihawk070);
    const opposingCostOneId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op04Kaido044, "south");

    const first = engine.pendingDecision("effectTargetSelection", "south");
    expect(first.actorId).toBe("south");
    const firstStep = first.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") throw new Error("Expected Kaido's cost-8 choice.");
    expect(firstStep).toMatchObject({ min: 0, max: 1 });
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownCostThreeId,
      ownCostFiveId,
      opposingCostEightId,
      opposingCostOneId,
    ]);
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingCostNineId,
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [opposingCostEightId] },
      "south",
    );

    const second = engine.pendingDecision("effectTargetSelection", "south");
    expect(second.actorId).toBe("south");
    const secondStep = second.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") throw new Error("Expected Kaido's cost-3 choice.");
    expect(secondStep).toMatchObject({ min: 0, max: 1 });
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownCostThreeId,
      opposingCostOneId,
    ]);
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownCostFiveId);
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingCostNineId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownCostThreeId] }, "south");

    // Opposing hands are hidden in the public view; raw state is the narrow physical-identity boundary.
    expect(engine.getState().players.north.hand).toContain(opposingCostEightId);
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownCostThreeId);
    expect(view.players.south.characters.some((card) => card?.instanceId === ownCostFiveId)).toBe(
      true,
    );
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingCostNineId),
    ).toBe(true);
    expect(
      view.players.north.characters.some((card) => card?.instanceId === opposingCostOneId),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero for each independent return", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op04Kaido044], activeDon: op04Kaido044.cost },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costFiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op04Kaido044, "south");

    const first = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(first).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const second = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(second).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === costOneId)).toBe(true);
    expect(view.players.north.characters.some((card) => card?.instanceId === costFiveId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
