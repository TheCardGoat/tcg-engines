import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Absalom081,
  op06Cerberus087,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-081 Absalom", () => {
  test("orders two trash cards as its optional cost, then K.O.s any cost-2-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Absalom081],
        character: [eb01Doma005],
        trash: [eb01Fourtricks025, eb01MountainGod018, op06Cerberus087],
        activeDon: op06Absalom081.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const firstCostId = engine.findCardInZone("south", "trash", eb01Fourtricks025);
    const secondCostId = engine.findCardInZone("south", "trash", op06Cerberus087);
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op06Absalom081, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Absalom's ordered trash cost.");
    expect(cost).toMatchObject({ min: 2, max: 2, ordered: true });
    engine.resolveDecision(
      "effectCostReturnTrashToDeck",
      { selectedIds: [secondCostId, firstCostId] },
      "south",
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Absalom's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual([secondCostId, firstCostId]);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      ownTargetId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without returning trash cards or K.O.ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06Absalom081],
        trash: [eb01Fourtricks025, op06Cerberus087],
        activeDon: op06Absalom081.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op06Absalom081, "south");
    const before = engine.getView("south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash).toHaveLength(before.players.south.trash.length);
    expect(view.players.south.deckCount).toBe(before.players.south.deckCount);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
