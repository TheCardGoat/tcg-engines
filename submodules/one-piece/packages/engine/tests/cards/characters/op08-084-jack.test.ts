import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op08Jack084 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-084 Jack", () => {
  test("has +4 cost, then rests to draw, trash, and K.O. a cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op08Jack084],
        hand: [eb01Doma005],
        deck: [eb01MountainGod018, eb01Doma005],
      },
      { character: [eb01Fourtricks025, eb01MountainGod018] },
    );
    const jackId = engine.findCardInZone("south", "character", op08Jack084);
    const retainedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const drawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jackId)
        ?.cost,
    ).toBe(11);

    engine.activateEffect(jackId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Jack's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([retainedId, drawnId]),
    );
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === jackId)
        ?.rested,
    ).toBe(true);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [drawnId] }, "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (ko?.kind !== "selectEntity") throw new Error("Expected Jack's K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(drawnId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === expensiveId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting, drawing, trashing, or K.O.ing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op08Jack084], deck: [eb01Doma005, eb01MountainGod018] },
      { character: [eb01Fourtricks025] },
    );
    const jackId = engine.findCardInZone("south", "character", op08Jack084);
    const targetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.activateEffect(jackId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jackId)?.rested).toBe(
      false,
    );
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
