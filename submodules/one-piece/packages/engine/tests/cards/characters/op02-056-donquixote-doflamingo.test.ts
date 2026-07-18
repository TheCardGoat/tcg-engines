import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02DonquixoteDoflamingo056,
  op02Mohji060,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-056 Donquixote Doflamingo", () => {
  test("on play reorders the top 3 cards to the chosen deck end", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02DonquixoteDoflamingo056],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op02DonquixoteDoflamingo056.cost,
    });
    const lookedIds = engine.getState().players.south.deck.slice(0, 3);

    engine.playCard(op02DonquixoteDoflamingo056, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Doflamingo's deck order.");
    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");

    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Doflamingo's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("with DON!! x1, may trash a hand card to bottom-deck only a cost-1 opponent", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: op02DonquixoteDoflamingo056, playedOnTurn: 0 }],
        activeDon: 1,
      },
      {
        character: [op02Mohji060, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const doflamingoId = engine.findCardInZone("south", "character", op02DonquixoteDoflamingo056);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eligibleId = engine.findCardInZone("north", "character", op02Mohji060);
    const excludedId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.attachDon(doflamingoId, 1, "south");
    engine.declareAttack(doflamingoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardedId,
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(engine.getState().players.north.deck.at(-1)).toBe(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing its hand or moving an opponent's Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: op02DonquixoteDoflamingo056, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [op02Mohji060] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const doflamingoId = engine.findCardInZone("south", "character", op02DonquixoteDoflamingo056);
    const handId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", op02Mohji060);

    engine.attachDon(doflamingoId, 1, "south");
    engine.declareAttack(doflamingoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([handId]);
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
