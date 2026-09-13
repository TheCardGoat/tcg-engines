import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05ShiningFinger120 } from "./120-shining-finger.ts";

describe("Shining Finger (GD05-120)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("moves the revealed Shield to its owner's hand when Burst is accepted", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [gd05ShiningFinger120], deck: 5 },
        { play: [attacker], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p1.getCardZone(gd05ShiningFinger120)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe('【Main】/【Action】Choose 1 enemy Unit with 4 or less HP. Rest it. Then, you may choose 1 of your Units with "Shining Gundam" in its card name. It gets <First Strike> during this turn.', () => {
    function setup() {
      const engine = GundamTestEngine.create(
        {
          hand: [gd05ShiningFinger120],
          play: [createMockUnit({ name: "Shining Gundam" })],
          resourceArea: activeResources(4),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      return {
        p1,
        p2,
        shiningId: p1.getCardsInZone("battleArea")[0]!,
        enemyId: p2.getCardsInZone("battleArea")[0]!,
      };
    }

    it("rests an eligible enemy and may grant First Strike to Shining Gundam during Main", () => {
      const { p1, p2, shiningId, enemyId } = setup();

      expectSuccess(p1.playCommand(gd05ShiningFinger120));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      const secondChoice = p1.getBoardView().pendingChoice;
      if (secondChoice?.kind !== "targetSelection") {
        throw new Error("Expected the optional Shining Gundam target choice");
      }
      const optionalDirectiveIndex = secondChoice.optionalDirectiveIndex;
      if (optionalDirectiveIndex === undefined) {
        throw new Error("Expected the Shining Gundam target choice to be optional");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [optionalDirectiveIndex]: true },
          targets: [shiningId],
        }),
      );
      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getVisibleCard(shiningId)?.keywords).toContain("FirstStrike");
    });

    it("rests an eligible enemy during a legally reached Action step", () => {
      const { p1, p2, enemyId } = setup();

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(gd05ShiningFinger120));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      const optionalChoice = p1.getBoardView().pendingChoice;
      if (optionalChoice?.kind !== "targetSelection") {
        throw new Error("Expected the optional Shining Gundam target choice");
      }
      const optionalDirectiveIndex = optionalChoice.optionalDirectiveIndex;
      if (optionalDirectiveIndex === undefined) {
        throw new Error("Expected the Shining Gundam target choice to be optional");
      }
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [optionalDirectiveIndex]: false },
        }),
      );

      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("finishes without a target prompt when no friendly Shining Gundam is in play", () => {
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [gd05ShiningFinger120], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(gd05ShiningFinger120));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects an enemy Unit above the printed HP limit", () => {
      const tooHealthy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [gd05ShiningFinger120], resourceArea: activeResources(4) },
        { play: [tooHealthy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const tooHealthyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(gd05ShiningFinger120, { targets: [tooHealthyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(gd05ShiningFinger120)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
