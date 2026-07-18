import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pagaya109,
  op05Satori105,
  op05Shura106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-106 Shura", () => {
  test("finds an included Sky Island type, excludes Shura, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05Shura106],
      deck: [
        op05Satori105,
        op05Pagaya109,
        op05Shura106,
        eb01Doma005,
        eb01MountainGod018,
        eb01Doma005,
      ],
      activeDon: op05Shura106.cost,
    });
    const compoundTraitId = engine.findCardInZone("south", "deck", op05Satori105);
    const exactTraitId = engine.findCardInZone("south", "deck", op05Pagaya109);
    const excludedNameId = engine.findCardInZone("south", "deck", op05Shura106);

    engine.playCard(op05Shura106, "south");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Shura's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === compoundTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === exactTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === excludedNameId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [compoundTraitId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Shura's bottom order.");
    const order = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(compoundTraitId);
    expect(engine.getState().players.south.deck.slice(-4)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("plays the resolving physical Life Trigger card before its On Play search", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op05Shura106],
        deck: [
          op05Satori105,
          op05Pagaya109,
          eb01Doma005,
          eb01MountainGod018,
          eb01Doma005,
          eb01Doma005,
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const shuraId = engine.findCardInZone("north", "life", op05Shura106);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(shuraId);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Shura's Trigger search order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(shuraId);
    expect(view.prompts).toHaveLength(0);
  });
});
