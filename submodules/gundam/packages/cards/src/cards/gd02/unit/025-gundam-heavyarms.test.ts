import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02GundamHeavyarms025 } from "./025-gundam-heavyarms.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Gundam Heavyarms (GD02-025)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamHeavyarms025],
        resourceArea: activeResources(3),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02GundamHeavyarms025],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Operation Meteor) Trait", () => {
    it("can attack on its deploy turn after an Operation Meteor Pilot is paired", () => {
      const operationMeteorPilot = createMockPilot({
        traits: ["operation meteor"],
        level: 1,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [gd02GundamHeavyarms025, operationMeteorPilot],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));
      const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(operationMeteorPilot, heavyarmsId));
      expectSuccess(p1.enterBattle(heavyarmsId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: heavyarmsId });
    });

    it("cannot attack on its deploy turn after a Pilot from another trait is paired", () => {
      const otherPilot = createMockPilot({ traits: ["oz"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02GundamHeavyarms025, otherPilot],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));
      const heavyarmsId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, heavyarmsId));

      expectFailure(p1.enterBattle(heavyarmsId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("【Deploy】Look at the top card of your deck. Return it to the top or bottom of your deck.", () => {
    it("returns the revealed card to the top and draws that card on its next turn", () => {
      const revealed = createMockUnit({ name: "Revealed Card" });
      const sentinel = createMockUnit({ name: "Bottom Sentinel" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GundamHeavyarms025],
          resourceArea: activeResources(4),
          deck: [sentinel, revealed],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      const revealedId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toTop: [revealedId] } },
        }),
      );
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expect(p1.getCardZone(revealedId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("returns the revealed card to the bottom so a different card is drawn next turn", () => {
      const revealed = createMockUnit({ name: "Revealed Card" });
      const sentinel = createMockUnit({ name: "Top Sentinel" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd02GundamHeavyarms025],
          resourceArea: activeResources(4),
          deck: [sentinel, revealed],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a visible deck-look choice");
      const revealedId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { toBottom: [revealedId] } },
        }),
      );
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      const playerView = p1.getBoardView().players[PLAYER_ONE]!;
      expect(playerView.hand?.map((card) => card.instanceId)).not.toContain(revealedId);
      expect(playerView.hand?.map((card) => card.definitionId)).toContain(sentinel.cardNumber);
      expect(playerView).toMatchObject({ handCount: 1, deckCount: 1 });
    });

    it("deploys cleanly with an empty deck and publishes no stale choice", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02GundamHeavyarms025],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02GundamHeavyarms025));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(gd02GundamHeavyarms025)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
