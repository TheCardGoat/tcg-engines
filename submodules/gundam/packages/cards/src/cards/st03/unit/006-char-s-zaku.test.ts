import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st03CharSZaku006 } from "./006-char-s-zaku.ts";

describe("Char's Zaku Ⅱ (ST03-006)", () => {
  describe("【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand.", () => {
    it("tutors a matching Zeon Unit from the top 3 when destroyed", () => {
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 4, hp: 5 });
      const zeonUnit = createMockUnit({ traits: ["zeon"] });
      const nonMatch1 = createMockUnit({ traits: ["earth federation"] });
      const nonMatch2 = createMockUnit({ traits: [] });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [nonMatch1, zeonUnit, nonMatch2],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "deckLook",
        sourceCardId: zakuId,
        directiveIndex: 0,
      });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const zeonUnitId = choice.legalTutorCardIds[0];
      if (!zeonUnitId) throw new Error("Expected a legal Zeon Unit choice");
      const remainingIds = choice.revealedCardIds.filter((cardId) => cardId !== zeonUnitId);

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { 0: { tutorCardId: zeonUnitId, toBottom: remainingIds } },
        }),
      );

      expect(p1.getCardZone(zakuId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getHand()).toContain(zeonUnitId);
      expect(p1.getCardsInZone("deck")).toEqual(remainingIds);
    });
  });
});
