import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectCard,
  expectLogType,
  expectPlayer,
  expectPublicLog,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05ReGz019 } from "./019-re-gz.ts";

describe("Re-GZ (GD05-019)", () => {
  describe("【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Londo Bell) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.", () => {
    it("offers only a Londo Bell Unit from the top three and adds the chosen card to hand", () => {
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const eligible = createMockUnit({ traits: ["londo bell"] });
      const engine = GundamTestEngine.create(
        {
          play: [gd05ReGz019],
          deck: [eligible, createMockUnit({ traits: ["neo zeon"] }), createMockUnit()],
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(gd05ReGz019).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05ReGz019);
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_TWO,
      });
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();
      expectLogType(engine, "gundam.combat.unitDefeated", { min: 1 });
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Re-GZ's deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(3);
      expect(choice.legalTutorCardIds).toHaveLength(1);
      const chosenId = choice.legalTutorCardIds[0]!;
      // deckLookAnswers is not on the fluent resolveEffect opts surface yet
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );

      expectCard(p1, gd05ReGz019).toBeIn("trash");
      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expectPlayer(p1).toHaveDeckCount(2);
    });

    it("returns the looked-at cards without adding a card when no Londo Bell Unit is available", () => {
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05ReGz019],
          deck: [createMockUnit({ traits: ["neo zeon"] }), createMockUnit(), createMockUnit()],
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(gd05ReGz019).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      p2.must.attack(attacker).into(gd05ReGz019);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Re-GZ's deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(0);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expectCard(p1, gd05ReGz019).toBeIn("trash");
      expectPlayer(p1).toHaveHandCount(0).toHaveDeckCount(3);
    });

    it("returns all three cards to the deck when the optional reveal is declined", () => {
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const eligible = createMockUnit({ traits: ["londo bell"] });
      const engine = GundamTestEngine.create(
        {
          play: [gd05ReGz019],
          deck: [eligible, createMockUnit(), createMockUnit()],
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(gd05ReGz019).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05ReGz019);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Re-GZ's deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(1);
      expectSuccess(p1.resolveEffect({ deckLookAnswers: { [choice.directiveIndex]: {} } }));

      expectPlayer(p1).toHaveHandCount(0).toHaveDeckCount(3);
    });

    it("looks at fewer than three cards when the deck is short", () => {
      const attacker = createMockUnit({ ap: 10, hp: 10 });
      const eligible = createMockUnit({ traits: ["londo bell"] });
      const engine = GundamTestEngine.create(
        {
          play: [gd05ReGz019],
          deck: [eligible],
          shieldArea: [createMockUnit()],
        },
        { play: [attacker], deck: 3, shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(gd05ReGz019).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(gd05ReGz019);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Re-GZ's deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(1);
      expect(choice.legalTutorCardIds).toHaveLength(1);
      const chosenId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: { [choice.directiveIndex]: { tutorCardId: chosenId } },
        }),
      );

      expect(p1.getCardZone(chosenId)).toBe(`hand:${PLAYER_ONE}`);
      expectPlayer(p1).toHaveDeckCount(0);
    });
  });
});
