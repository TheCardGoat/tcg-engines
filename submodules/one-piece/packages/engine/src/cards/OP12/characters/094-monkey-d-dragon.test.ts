import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op12Koala081 } from "@tcg/op-cards";
import { op12Hack089 } from "../../../../../cards/src/cards/OP12/characters/089-hack.ts";
import { op12Karasu085 } from "../../../../../cards/src/cards/OP12/characters/085-karasu.ts";
import { op12Koala086 } from "../../../../../cards/src/cards/OP12/characters/086-koala.ts";
import { op12MonkeyDDragon094 } from "../../../../../cards/src/cards/OP12/characters/094-monkey-d-dragon.ts";
import { op12Morley093 } from "../../../../../cards/src/cards/OP12/characters/093-morley.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function resolveOrderedCost(engine: OnePieceTestEngine, selectedIds: string[]) {
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  const cost = engine.pendingDecision("effectCostReturnTrashToDeck", "south").steps[0];
  if (cost?.kind !== "payCost") throw new Error("Expected Dragon's ordered trash cost.");
  expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual(
    expect.arrayContaining(selectedIds),
  );
  engine.resolveDecision("effectCostReturnTrashToDeck", { selectedIds }, "south");
}

describe("OP12-094 Monkey.D.Dragon", () => {
  test("orders three Revolutionary Army cards as cost, then plays an eligible trash Character", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12Koala081,
      hand: [op12MonkeyDDragon094],
      trash: [op12Karasu085, op12Koala086, op12Morley093, op12Hack089, eb01Doma005],
      activeDon: op12MonkeyDDragon094.cost,
    });
    const paymentIds = [op12Karasu085, op12Koala086, op12Morley093].map((card) =>
      engine.findCardInZone("south", "trash", card),
    );
    const hackId = engine.findCardInZone("south", "trash", op12Hack089);
    const nonTraitId = engine.findCardInZone("south", "trash", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op12MonkeyDDragon094, "south");
    resolveOrderedCost(engine, paymentIds.reverse());
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Dragon's trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(hackId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(nonTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [hackId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore + 3);
    expect(view.players.south.characters.some((card) => card?.instanceId === hackId)).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("without a Revolutionary Army Leader may pay the cost but does not play from trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op12MonkeyDDragon094],
      trash: [op12Karasu085, op12Koala086, op12Morley093, eb01Doma005],
      activeDon: op12MonkeyDDragon094.cost,
    });
    const paymentIds = [op12Karasu085, op12Koala086, op12Morley093].map((card) =>
      engine.findCardInZone("south", "trash", card),
    );
    const remainingId = engine.findCardInZone("south", "trash", eb01Doma005);

    engine.playCard(op12MonkeyDDragon094, "south");
    resolveOrderedCost(engine, paymentIds.reverse());

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(remainingId);
    expect(view.players.south.characters.some((card) => card?.instanceId === remainingId)).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
