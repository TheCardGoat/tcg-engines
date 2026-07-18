import { describe, expect, test } from "vite-plus/test";
import {
  eb01Cavendish012,
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb03Hina025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-025 Hina", () => {
  test("trashes a chosen hand card and maps either player's base-power-6000 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Hina025, eb01Doma005, eb01MountainGod018],
        character: [eb01Cavendish012, eb01Fourtricks025],
        activeDon: 5,
      },
      { character: [eb01Cavendish012, eb01Fourtricks025] },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const ownTargetId = engine.findCardInZone("south", "character", eb01Cavendish012);
    const ownExcludedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Cavendish012);
    const opposingExcludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb03Hina025, "south");
    const hinaId = engine.findCardInZone("south", "character", eb03Hina025);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Hina's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardedId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Hina's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      hinaId,
      opposingTargetId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownExcludedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingExcludedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownTargetId,
    );
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
