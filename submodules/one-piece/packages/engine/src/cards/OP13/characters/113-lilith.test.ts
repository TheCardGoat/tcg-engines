import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op13Conney106 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13Lilith113 } from "../../../../../cards/src/cards/OP13/characters/113-lilith.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-113 Lilith", () => {
  test("searches the top four for a non-Lilith Trigger and bottom-orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13Lilith113],
      deck: [op13Conney106, op13Lilith113, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13Lilith113.cost,
    });
    const eligibleId = engine.findCardInZone("south", "deck", op13Conney106);
    const excludedNameId = engine.findCardInZone("south", "deck", op13Lilith113);
    const noTriggerId = engine.findCardInZone("south", "deck", eb01Doma005);
    const otherNoTriggerId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const untouchedId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op13Lilith113, "south");
    const decision = engine.pendingDecision("effectSearchSelection", "south");
    expect(decision.actorId).toBe("south");
    const search = decision.steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Lilith's search choice.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    expect(search.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    for (const excludedId of [excludedNameId, noTriggerId, otherNoTriggerId]) {
      expect(search.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
        false,
      );
    }
    engine.resolveDecision("effectSearchSelection", { selectedIds: [eligibleId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected Lilith's remainder order.");
    const submittedOrder = remainder.candidates.map((candidate) => candidate.ref.id).reverse();
    expect(submittedOrder).toEqual(
      expect.arrayContaining([excludedNameId, noTriggerId, otherNoTriggerId]),
    );
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: submittedOrder }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().players.south.deck).toEqual([untouchedId, ...submittedOrder]);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger activates On Play without playing Lilith, then sends the Trigger card to trash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13Lilith113, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [op13Conney106, op13Lilith113, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const triggerId = engine.findCardInZone("north", "life", op13Lilith113);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").actorId).toBe("north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    if (remainder?.kind !== "orderItems")
      throw new Error("Expected Lilith's Trigger search order.");
    expect(remainder.candidates).toHaveLength(4);
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id).reverse() },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(triggerId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(triggerId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(triggerId);
    expect(view.prompts).toHaveLength(0);
  });
});
