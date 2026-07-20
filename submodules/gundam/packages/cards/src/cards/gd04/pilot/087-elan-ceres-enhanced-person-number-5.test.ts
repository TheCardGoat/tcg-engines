import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ElanCeresEnhancedPersonNumber5087 } from "./087-elan-ceres-enhanced-person-number-5.ts";

describe("Elan Ceres (Enhanced Person Number 5) (GD04-087)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04ElanCeresEnhancedPersonNumber5087] },
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
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: expect.any(String),
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
  });

  describe("【During Link】【Attack】You may choose 1 of your (Academy) Units. During this battle, battle damage this Unit would receive is dealt to that Unit instead.", () => {
    it("redirects the linked Unit's incoming battle damage to the chosen Academy Unit", () => {
      const host = createMockUnit({
        name: "Elan Host",
        ap: 1,
        hp: 8,
        linkCondition: "[Elan Ceres (Enhanced Person Number 5)]",
      });
      const academyUnit = createMockUnit({ name: "Academy Ally", traits: ["academy"], hp: 8 });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ElanCeresEnhancedPersonNumber5087],
          play: [host, academyUnit],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, academyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04ElanCeresEnhancedPersonNumber5087, hostId!));
      expectSuccess(p1.enterBattle(hostId!, enemyId));
      expectSuccess(p1.resolveEffect({ targets: [academyId!], optionalAnswers: { 0: true } }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(hostId!)).toBe(0);
      expect(p1.getDamage(academyId!)).toBe(2);
    });

    it("deals battle damage to the linked Unit when the player declines the redirect", () => {
      const host = createMockUnit({
        name: "Elan Host",
        ap: 1,
        hp: 8,
        linkCondition: "[Elan Ceres (Enhanced Person Number 5)]",
      });
      const academyUnit = createMockUnit({ name: "Academy Ally", traits: ["academy"], hp: 8 });
      const enemy = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04ElanCeresEnhancedPersonNumber5087],
          play: [host, academyUnit],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, academyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04ElanCeresEnhancedPersonNumber5087, hostId!));
      expectSuccess(p1.enterBattle(hostId!, enemyId));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(hostId!)).toBe(2);
      expect(p1.getDamage(academyId!)).toBe(0);
    });
  });
});
