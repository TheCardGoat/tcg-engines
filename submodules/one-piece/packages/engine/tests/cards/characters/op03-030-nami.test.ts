import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op03Gin024,
  op03Kuroobi026,
  op03Nami030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-030 Nami", () => {
  test("searches five for a different green card with an included East Blue trait", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Nami030],
      deck: [op03Gin024, op03Kuroobi026, op03Nami030, eb01MountainGod018, eb01Doma005],
      activeDon: op03Nami030.cost,
    });
    const ginId = engine.findCardInZone("south", "deck", op03Gin024);
    const kuroobiId = engine.findCardInZone("south", "deck", op03Kuroobi026);
    const otherNamiId = engine.findCardInZone("south", "deck", op03Nami030);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const wrongColorId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op03Nami030, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's search choice.");
    expect(
      search.candidates.filter((candidate) => candidate.legal).map((candidate) => candidate.ref.id),
    ).toEqual(expect.arrayContaining([ginId, kuroobiId]));
    expect(search.candidates.find((candidate) => candidate.ref.id === otherNamiId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongColorId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [ginId] }, "south");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ginId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("Life Trigger plays the resolving physical card and continues into its search", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op03Nami030],
        deck: [op03Gin024, op03Kuroobi026, op03Nami030, eb01MountainGod018, eb01Doma005],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const lifeId = engine.findCardInZone("north", "life", op03Nami030);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const search = engine.pendingDecision("effectSearchSelection", "north").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Nami's Trigger search.");
    expect(search).toMatchObject({ min: 0, max: 1 });
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "north");

    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    expect(remainder?.kind).toBe("orderItems");
    if (remainder?.kind !== "orderItems") throw new Error("Expected Nami's bottom order.");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: remainder.candidates.map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === lifeId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
