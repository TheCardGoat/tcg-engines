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
import { eb01WarshipCruise082 } from "./082-warship-cruise.ts";

describe("Warship Cruise (EB01-082)", () => {
  describe("【Burst】Activate this card's 【Action】.", () => {
    function revealBurst(targetLevel: number) {
      const attacker = createMockUnit({ level: targetLevel, ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [eb01WarshipCruise082] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      return { p1, p2, attackerId };
    }

    it("replays its Action for free against an eligible enemy Unit", () => {
      const { p1, p2, attackerId } = revealBurst(3);
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      const shieldId = burst.sourceCardId;

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [attackerId],
      });
      expectSuccess(p1.resolveEffect({ targets: [attackerId] }));

      expect(p2.getCardZone(attackerId)).toBe(`hand:${PLAYER_TWO}`);
      expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not offer Burst when its replayed Action has no legal target", () => {
      const { p1, p2, attackerId } = revealBurst(4);

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardZone(attackerId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getCardZone(eb01WarshipCruise082)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Action】Choose 1 Unit that is Lv.3 or lower belonging to each enemy player. Return them to their owners' hands.", () => {
    it("returns an enemy Unit at Lv.3 or lower during an Action window", () => {
      const engine = GundamTestEngine.create(
        { hand: [eb01WarshipCruise082], resourceArea: activeResources(3) },
        { play: [createMockUnit({ level: 3, ap: 2 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(eb01WarshipCruise082));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit above Lv.3", () => {
      const engine = GundamTestEngine.create(
        { hand: [eb01WarshipCruise082], resourceArea: activeResources(3) },
        { play: [createMockUnit({ level: 4, ap: 2 })] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(eb01WarshipCruise082, { targets: [enemyId] }), "INVALID_TARGET");
      expect(p1.getCardZone(eb01WarshipCruise082)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
