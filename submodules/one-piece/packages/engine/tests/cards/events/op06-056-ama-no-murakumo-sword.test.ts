import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05BartholomewKuma011,
  op06AmaNoMurakumoSword056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-056 Ama no Murakumo Sword", () => {
  test("Main maps the cost-2 then cost-1 choices into controller-selected bottom-deck order", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06AmaNoMurakumoSword056],
        activeDon: 2,
      },
      {
        deck: [eb01MountainGod018],
        character: [eb01Doma005, op05BartholomewKuma011],
      },
    );
    const costOneId = engine.findCardInZone("north", "character", eb01Doma005);
    const costTwoId = engine.findCardInZone("north", "character", op05BartholomewKuma011);
    const originalDeckId = engine.findCardInZone("north", "deck", eb01MountainGod018);

    engine.playCard(op06AmaNoMurakumoSword056);

    const firstDecision = engine.pendingDecision("effectTargetSelection", "south");
    const firstStep = firstDecision.steps[0];
    expect(firstStep?.kind).toBe("selectEntity");
    if (firstStep?.kind !== "selectEntity") {
      throw new Error("Expected the first cost-2-or-less bottom-deck choice.");
    }
    expect(firstStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      costOneId,
      costTwoId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costTwoId] }, "south");

    const secondDecision = engine.pendingDecision("effectTargetSelection", "south");
    const secondStep = secondDecision.steps[0];
    expect(secondStep?.kind).toBe("selectEntity");
    if (secondStep?.kind !== "selectEntity") {
      throw new Error("Expected the remaining cost-1-or-less bottom-deck choice.");
    }
    expect(secondStep.candidates.map((candidate) => candidate.ref.id)).toEqual([costOneId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costOneId] }, "south");

    expect(engine.getState().players.north.deck).toEqual([originalDeckId, costTwoId, costOneId]);
    expect(engine.getView("south").players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
