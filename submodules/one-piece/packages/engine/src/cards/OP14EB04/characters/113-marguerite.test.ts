import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07BoaHancock038,
  op08Shakuyaku046,
  op13BoaHancock051,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Marguerite113 } from "../../../../../cards/src/cards/OP14EB04/characters/113-marguerite.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-113 Marguerite", () => {
  test("search accepts either included trait, reveals the selected identity, orders the remainder, then mandates one hand trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Marguerite113, eb01Doma005],
      deck: [
        op08Shakuyaku046,
        op13BoaHancock051,
        eb01Doma005,
        eb01Fourtricks025,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op14eb04Marguerite113.cost,
    });
    const initialHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const amazonLilyId = engine.findCardInZone("south", "deck", op08Shakuyaku046);
    const kujaIncludedId = engine.findCardInZone("south", "deck", op13BoaHancock051);
    const wrongIds = [
      engine.findCardInZone("south", "deck", eb01Doma005),
      engine.findCardInZone("south", "deck", eb01Fourtricks025),
      engine.findCardInZone("south", "deck", eb01MountainGod018),
    ];

    engine.playCard(op14eb04Marguerite113, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Marguerite's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === amazonLilyId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === kujaIncludedId)?.legal).toBe(
      true,
    );
    for (const wrongId of wrongIds) {
      expect(search.candidates.find((candidate) => candidate.ref.id === wrongId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [kujaIncludedId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Marguerite's bottom order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Marguerite's mandatory trash.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([initialHandId, kujaIncludedId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [initialHandId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(kujaIncludedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(initialHandId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(submittedOrder);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger with an included Kuja Leader plays the physical card and resolves its On Play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op07BoaHancock038,
        life: [op14eb04Marguerite113, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        hand: [eb01Doma005],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Marguerite113);
    const handId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Trigger search order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(handId);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger cannot play Marguerite without a Kuja Pirates Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Marguerite113, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op14eb04Marguerite113);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
