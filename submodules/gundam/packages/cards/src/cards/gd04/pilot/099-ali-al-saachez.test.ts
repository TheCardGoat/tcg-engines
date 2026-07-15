import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04AliAlSaachez099 } from "./099-ali-al-saachez.ts";

describe("Ali al-Saachez (GD04-099)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04AliAlSaachez099] },
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

  describe("【During Link】【Attack】You may choose 1 enemy Pilot. Return it to its owner's hand.", () => {
    function setup(linkCondition: string) {
      const aliUnit = createMockUnit({
        name: "Ali Host",
        ap: 3,
        hp: 6,
        level: 4,
        cost: 2,
        linkCondition,
      });
      const enemyUnit = createMockUnit({
        name: "Enemy Host",
        ap: 1,
        hp: 6,
        level: 3,
        cost: 1,
      });
      const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04AliAlSaachez099],
          play: [aliUnit],
          resourceArea: activeResources(4),
          deck: 3,
        },
        {
          hand: [enemyPilot],
          play: [{ card: enemyUnit, exhausted: true }],
          resourceArea: activeResources(1),
          deck: 3,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const aliUnitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyUnitId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(enemyPilot, enemyUnitId));
      const enemyPilotId = p2.getPilotId(enemyUnitId)!;
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.assignPilot(gd04AliAlSaachez099, aliUnitId));

      return { p1, p2, aliUnitId, enemyUnitId, enemyPilotId };
    }

    it("returns a chosen enemy Pilot to hand when Ali's linked Unit attacks", () => {
      const { p1, p2, aliUnitId, enemyUnitId, enemyPilotId } = setup("[Ali al-Saachez]");

      expectSuccess(p1.enterBattle(aliUnitId, enemyUnitId));
      expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      expect(p1.getBoardView().pendingChoice?.kind).toBe("targetSelection");
      expectSuccess(p1.resolveEffect({ targets: [enemyPilotId] }));

      expect(p2.getHand()).toContain(enemyPilotId);
      expect(p2.getPilotId(enemyUnitId)).toBeUndefined();
    });

    it("does not fire when Ali is paired but not linked", () => {
      const { p1, p2, aliUnitId, enemyUnitId, enemyPilotId } = setup("[Different Pilot]");

      expectSuccess(p1.enterBattle(aliUnitId, enemyUnitId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getHand()).toHaveLength(0);
      expect(p2.getPilotId(enemyUnitId)).toBe(enemyPilotId);
    });
  });
});
