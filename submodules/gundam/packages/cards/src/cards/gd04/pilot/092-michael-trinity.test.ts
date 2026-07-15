import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04MichaelTrinity092 } from "./092-michael-trinity.ts";

describe("Michael Trinity (GD04-092)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04MichaelTrinity092] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【When Linked】Choose 1 damaged enemy Unit. Deal 1 damage to it.", () => {
    it("deals 1 damage to the damaged enemy Unit when Michael creates a Link Unit", () => {
      const host = createMockUnit({ linkCondition: "[Michael Trinity]" });
      const damagedEnemy = createMockUnit({ hp: 5 });
      const freshEnemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04MichaelTrinity092],
          play: [host],
          resourceArea: activeResources(5),
        },
        {
          play: [{ card: damagedEnemy, damage: 1 }, freshEnemy],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const [damagedEnemyId, freshEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04MichaelTrinity092, hostId));
      expectSuccess(p1.resolveEffect({ targets: [damagedEnemyId!] }));

      expect(p2.getDamage(damagedEnemyId!)).toBe(2);
      expect(p2.getDamage(freshEnemyId!)).toBe(0);
    });

    it("does not deal damage when the paired Unit's link condition is not satisfied", () => {
      const host = createMockUnit({ linkCondition: "[Different Pilot]" });
      const damagedEnemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04MichaelTrinity092],
          play: [host],
          resourceArea: activeResources(5),
        },
        { play: [{ card: damagedEnemy, damage: 1 }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const damagedEnemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04MichaelTrinity092, hostId));

      expect(p2.getDamage(damagedEnemyId)).toBe(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
