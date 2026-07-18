import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Shanks120, op06Shanks007 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-007 Shanks", () => {
  test("K.O.s up to one opposing power-10000-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op06Shanks007], activeDon: op06Shanks007.cost },
      { character: [op01Shanks120, op06Shanks007, eb01MountainGod018] },
    );
    const boundaryId = engine.findCardInZone("north", "character", op01Shanks120);
    const tooPowerfulId = engine.findCardInZone("north", "character", op06Shanks007);
    const lowerPowerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Shanks007, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's K.O. choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([
      boundaryId,
      lowerPowerId,
    ]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [boundaryId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(boundaryId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(tooPowerfulId);
    expect(view.prompts).toHaveLength(0);
  });
});
