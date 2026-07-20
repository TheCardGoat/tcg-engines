import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb01MonkeyDLuffyP055JollyRogerFoil055 } from "../../../../../cards/src/cards/PRB01/characters/055-monkey-d-luffy-p-055-jolly-roger-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-055 Monkey.D.Luffy (P-055) (Jolly Roger Foil)", () => {
  test("trashes two selected own hand cards, then the opponent bottoms one of their Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          prb01MonkeyDLuffyP055JollyRogerFoil055,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
        activeDon: prb01MonkeyDLuffyP055JollyRogerFoil055.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const firstPaymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondPaymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const retainedId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const selectedTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(prb01MonkeyDLuffyP055JollyRogerFoil055, "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Luffy's exact hand-trash cost.");
    expect(cost).toMatchObject({ min: 2, max: 2 });
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstPaymentId, secondPaymentId, retainedId]),
    );
    engine.resolveDecision(
      "effectCostTrashFromHand",
      { selectedIds: [firstPaymentId, secondPaymentId] },
      "south",
    );

    const choice = engine.pendingDecision("effectTargetSelection", "north");
    expect(choice.actorId).toBe("north");
    const target = choice.steps[0];
    if (target?.kind !== "selectEntity")
      throw new Error("Expected the opponent's Character choice.");
    expect(target).toMatchObject({ min: 1, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstTargetId, selectedTargetId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedTargetId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstPaymentId, secondPaymentId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(firstTargetId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      selectedTargetId,
    );
    expect(engine.getState().players.north.deck.at(-1)).toBe(selectedTargetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing hand cards or offering the opponent a target choice", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb01MonkeyDLuffyP055JollyRogerFoil055, eb01Doma005, eb01Fourtricks025],
        activeDon: prb01MonkeyDLuffyP055JollyRogerFoil055.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const firstHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondHandId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb01MonkeyDLuffyP055JollyRogerFoil055, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstHandId, secondHandId]),
    );
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot activate the optional effect with fewer than two cards left in hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb01MonkeyDLuffyP055JollyRogerFoil055, eb01Doma005],
        activeDon: prb01MonkeyDLuffyP055JollyRogerFoil055.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb01MonkeyDLuffyP055JollyRogerFoil055, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
