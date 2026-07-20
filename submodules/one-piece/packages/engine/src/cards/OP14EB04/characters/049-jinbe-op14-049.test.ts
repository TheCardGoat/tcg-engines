import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01YouCanBeMySamurai055,
  op13Otama043,
  op14eb04EdwardNewgate044,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04JinbeOp14049049 } from "../../../../../cards/src/cards/OP14EB04/characters/049-jinbe-op14-049.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-049 Jinbe", () => {
  test("gains Rush this turn when an effect trashes a selected physical card from its controller's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        life: 3,
        hand: [op14eb04JinbeOp14049049, op13Otama043, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: op14eb04JinbeOp14049049.cost + op13Otama043.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op14eb04JinbeOp14049049, "south");
    const jinbeId = engine.findCardInZone("south", "character", op14eb04JinbeOp14049049);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: jinbeId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);

    engine.playCard(op13Otama043, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Otama's hand-trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toContain(discardedId);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "south");

    engine.declareAttack(jinbeId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain Rush when a Main Event is moved from hand to trash by rule", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04JinbeOp14049049, op01YouCanBeMySamurai055],
        character: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04JinbeOp14049049.cost + op01YouCanBeMySamurai055.cost,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eventId = engine.findCardInZone("south", "hand", op01YouCanBeMySamurai055);

    engine.playCard(op14eb04JinbeOp14049049, "south");
    const jinbeId = engine.findCardInZone("south", "character", op14eb04JinbeOp14049049);
    engine.playCard(op01YouCanBeMySamurai055, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: jinbeId,
        targetId: engine.leader("north"),
      }).accepted,
    ).toBe(false);
    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("on play may rest two DON, draw two exact cards, and return either owner's cost-7-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04JinbeOp14049049],
        character: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: op14eb04JinbeOp14049049.cost + 2,
      },
      { character: [eb01Doma005, op14eb04EdwardNewgate044] },
    );
    const ownTargetId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", op14eb04EdwardNewgate044);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op14eb04JinbeOp14049049, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownTargetId, opposingTargetId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstDrawId, secondDrawId]),
    );
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 10 });
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(ownTargetId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      opposingTargetId,
    );
    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      opposingTargetId,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may pay the on-play cost and choose no Character to return", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04JinbeOp14049049],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: op14eb04JinbeOp14049049.cost + 2,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04JinbeOp14049049, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 2, deckCount: 1 });
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the on-play cost without drawing, resting extra DON, or returning a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04JinbeOp14049049],
        deck: [eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04JinbeOp14049049.cost + 2,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op14eb04JinbeOp14049049, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 0, deckCount: 2, activeDon: 2 });
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
