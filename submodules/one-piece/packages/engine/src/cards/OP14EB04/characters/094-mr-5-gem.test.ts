import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Shanks120 } from "@tcg/op-cards";
import type { CharacterCard } from "@tcg/op-types";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Mr5Gem094 } from "../../../../../cards/src/cards/OP14EB04/characters/094-mr-5-gem.ts";
import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";

import { OnePieceTestEngine } from "../../../index.ts";

const zeroCostCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP14-094-ZERO",
  canonicalId: "TEST-OP14-094-ZERO",
  cost: 0,
};
registerCards([zeroCostCharacter]);

function conditionedEngine(conditionCard: CharacterCard) {
  return OnePieceTestEngine.create({
    hand: [op14eb04Mr5Gem094, eb01MountainGod018],
    character: [conditionCard],
    deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
    activeDon: op14eb04Mr5Gem094.cost,
  });
}

describe("OP14-094 Mr.5(Gem)", () => {
  test("either a cost-0 or cost-8-plus Character enables ordered draw 2 then selected hand trash 1", () => {
    for (const conditionCard of [zeroCostCharacter, op01Shanks120]) {
      const engine = conditionedEngine(conditionCard);
      const paymentId = engine.findCardInZone("south", "hand", eb01MountainGod018);
      const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
      const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

      engine.playCard(op14eb04Mr5Gem094, "south");
      const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
      if (trash?.kind !== "selectEntity") throw new Error("Expected Mr.5's hand-trash choice.");
      expect(trash).toMatchObject({ min: 1, max: 1 });
      expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
        expect.arrayContaining([paymentId, firstDrawId, secondDrawId]),
      );
      engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paymentId] }, "south");

      const view = engine.getView("south");
      expect(view.players.south.hand.map((card) => card.instanceId)).toEqual(
        expect.arrayContaining([firstDrawId, secondDrawId]),
      );
      expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
      expect(view.prompts).toHaveLength(0);
    }
  });

  test("without either field condition does not draw or trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Mr5Gem094, eb01MountainGod018],
      deck: [eb01Doma005, eb01Fourtricks025],
      activeDon: op14eb04Mr5Gem094.cost,
    });
    engine.playCard(op14eb04Mr5Gem094, "south");
    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 2 });
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("uses Blocker to redirect an attack and protect Leader Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Mr5Gem094] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op14eb04Mr5Gem094);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(blockerId);
  });
});
