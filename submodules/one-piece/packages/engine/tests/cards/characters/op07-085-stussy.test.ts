import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op07Stussy085 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-085 Stussy", () => {
  test("trashes a chosen own Character as the cost to K.O. any opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Stussy085],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: op07Stussy085.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const ownCostId = engine.findCardInZone("south", "character", eb01Doma005);
    const otherOwnId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07Stussy085, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashCharacter", "south").steps[0];
    expect(cost).toMatchObject({ kind: "payCost", min: 1, max: 1 });
    if (cost?.kind !== "payCost") throw new Error("Expected Stussy's Character cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownCostId, otherOwnId]),
    );
    engine.resolveDecision("effectCostTrashCharacter", { selectedIds: [ownCostId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Stussy's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(ownCostId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(otherOwnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing either player's Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op07Stussy085],
        character: [eb01Doma005],
        activeDon: op07Stussy085.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op07Stussy085, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(ownId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(opposingId);
    expect(view.prompts).toHaveLength(0);
  });
});
