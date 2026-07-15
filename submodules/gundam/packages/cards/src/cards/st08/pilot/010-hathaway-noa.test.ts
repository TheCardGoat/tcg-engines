import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08HathawayNoa010 } from "./010-hathaway-noa.ts";

describe("Hathaway Noa (ST08-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds this card to hand when its shield is destroyed", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st08HathawayNoa010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const shieldId = p2.getCardsInZone("shieldArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: shieldId,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getHand()).toContain(shieldId);
    });
  });

  describe("【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.", () => {
    it("lets a friendly Mafty Unit attack a damaged active enemy Unit this turn", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [hostId],
      });
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expect(p1.getLegalAttackTargets(hostId)).toContain(enemyId);
      expectSuccess(p1.enterBattle(hostId, enemyId));
    });

    it("does not include an undamaged active enemy Unit in the granted target filter", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [hostId],
      });
      expectSuccess(p1.resolveEffect({ targets: [hostId] }));
      expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
      expectFailure(p1.enterBattle(hostId, enemyId), "INVALID_TARGET");
    });

    it("does not grant the option when Hathaway is paired to a non-Mafty Unit", () => {
      const host = createMockUnit({
        traits: ["earth federation"],
        linkCondition: "[Hathaway Noa]",
      });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getLegalAttackTargets(hostId)).not.toContain(enemyId);
    });
  });
});
