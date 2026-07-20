import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03Sogeking122,
  op03UsoppSPirateCrew042,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-122 Sogeking", () => {
  test("may return an eligible Character from either field, then draws two and trashes two", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Sogeking122],
        character: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op03Sogeking122.cost,
      },
      { character: [eb01MountainGod018, op03Sogeking122] },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op03Sogeking122);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op03Sogeking122, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Sogeking's return choice.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Sogeking's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(ownTargetId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toEqual(
      expect.arrayContaining([opposingTargetId, expensiveId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may return no Character and still draws two before trashing two", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03Sogeking122],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op03Sogeking122.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op03Sogeking122, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("is treated as Usopp by a name-filtered recovery effect", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03UsoppSPirateCrew042],
      trash: [op03Sogeking122],
      activeDon: op03UsoppSPirateCrew042.cost,
    });
    const sogekingId = engine.findCardInZone("south", "trash", op03Sogeking122);

    engine.playCard(op03UsoppSPirateCrew042, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected an Usopp recovery target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(sogekingId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sogekingId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      sogekingId,
    );
  });
});
