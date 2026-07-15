import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { gd04GarmaSDopp026 } from "./026-garma-s-dopp.ts";

describe("Garma's Dopp (GD04-026)", () => {
  describe("【Deploy】Look at the top card of your deck. Return it to the top of your deck or place it into your trash.", () => {
    it("looks at the top card of deck and places it into trash", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaSDopp026],
        resourceArea: activeResources(3),
        deck: 4,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.deployUnit(gd04GarmaSDopp026));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      const revealedCardId = choice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toTrash: [revealedCardId], toTop: [] } },
        }),
      );

      expect(p1.getCardZone(revealedCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("trash").length).toBe(trashBefore + 1);
    });

    it("reveals the same top card again after the player returns it to the top", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaSDopp026, gd04GarmaSDopp026],
        resourceArea: activeResources(6),
        deck: 4,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstDoppId, secondDoppId] = p1.getHand();

      expectSuccess(p1.deployUnit(firstDoppId!));
      const firstChoice = p1.getBoardView().pendingChoice;
      if (firstChoice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const revealedCardId = firstChoice.revealedCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { toTop: [revealedCardId], toTrash: [] } },
        }),
      );

      expectSuccess(p1.deployUnit(secondDoppId!));
      const simultaneousDeploys = p1.getBoardView().pendingChoice;
      if (simultaneousDeploys?.kind !== "ordering") {
        throw new Error("Expected simultaneous Deploy-effect ordering");
      }
      const secondDoppEffect = simultaneousDeploys.candidates.find(
        (candidate) => candidate.sourceCardId === secondDoppId,
      );
      expectSuccess(p1.resolveEffect({ pendingEffectId: secondDoppEffect!.effectId }));
      const secondChoice = p1.getBoardView().pendingChoice;
      if (secondChoice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(secondChoice.revealedCardIds).toEqual([revealedCardId]);
      expect(p1.getCardZone(revealedCardId)).toBe(`deck:${PLAYER_ONE}`);
    });

    it("deploys successfully with an empty deck and leaves trash unchanged", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04GarmaSDopp026],
        resourceArea: activeResources(3),
        deck: [],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd04GarmaSDopp026));

      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toEqual([]);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
