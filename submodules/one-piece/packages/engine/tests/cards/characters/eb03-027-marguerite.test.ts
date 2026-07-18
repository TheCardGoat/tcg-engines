import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, eb03Marguerite027 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-027 Marguerite", () => {
  test("maps either player's base-power-7000 Character and returns the chosen card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb03Marguerite027],
        character: [eb01MountainGod018, eb01Fourtricks025],
        activeDon: 6,
      },
      { character: [eb01MountainGod018, eb01Fourtricks025] },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const ownExcludedId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const opposingExcludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb03Marguerite027, "south");
    const margueriteId = engine.findCardInZone("south", "character", eb03Marguerite027);

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Marguerite's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      ownTargetId,
      margueriteId,
      opposingTargetId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ownExcludedId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingExcludedId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
