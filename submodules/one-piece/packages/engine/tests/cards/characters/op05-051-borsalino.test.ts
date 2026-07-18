import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Borsalino051,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-051 Borsalino", () => {
  test("may bottom-deck a current-cost-4 Character from either field for its owner", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Borsalino051], character: [eb01Doma005], activeDon: 7 },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op05Borsalino051, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Borsalino's Character target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    expect(engine.getState().players.north.deck.at(-1)).toBe(opposingId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may choose zero", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Borsalino051], activeDon: 7 },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.playCard(op05Borsalino051, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(targetId);
  });
});
