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
import { gd05KayraSu086 } from "./086-kayra-su.ts";

describe("Kayra Su (GD05-086)", () => {
  /** @behavioral-proof complete: automatic return Burst and every Link/rest/attacker restriction branch are public. */
  describe("【Burst】Add this card to your hand.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05KayraSu086] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      return { p2 };
    }

    it("adds Kayra Su to hand when its controller accepts Burst", () => {
      const { p2 } = revealBurst();
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p2.getCardZone(gd05KayraSu086)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("puts Kayra Su in trash when its controller declines Burst", () => {
      const { p2 } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));
      expect(p2.getCardZone(gd05KayraSu086)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【During Link】Enemy Units other than Link Units choose this rested Unit as their attack target if possible when attacking.", () => {
    function setup({
      linked = true,
      rested = true,
      linkAttacker = false,
    }: {
      linked?: boolean;
      rested?: boolean;
      linkAttacker?: boolean;
    } = {}) {
      const host = createMockUnit({
        name: "Kayra Host",
        hp: 8,
        linkCondition: linked ? "[Kayra Su]" : "[Other Pilot]",
      });
      const otherTarget = createMockUnit({ name: "Other Rested Target", hp: 8 });
      const enemyPilot = createMockPilot({
        name: "Enemy Link Pilot",
        level: 1,
        cost: 1,
      });
      const attacker = createMockUnit({
        name: "Enemy Attacker",
        ap: 3,
        hp: 8,
        linkCondition: "[Enemy Link Pilot]",
      });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05KayraSu086],
          play: [
            { card: host, exhausted: rested },
            { card: otherTarget, exhausted: true },
          ],
          resourceArea: activeResources(5),
          deck: 5,
        },
        {
          hand: linkAttacker ? [enemyPilot] : [],
          play: [attacker],
          resourceArea: activeResources(1),
          deck: 5,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, otherTargetId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05KayraSu086, hostId!));
      engine.endTurn();
      if (linkAttacker) {
        expectSuccess(p2.assignPilot(enemyPilot, attackerId));
      }

      return { p2, hostId: hostId!, otherTargetId: otherTargetId!, attackerId };
    }

    it("forces an unlinked enemy Unit to attack Kayra's rested linked Unit", () => {
      const { p2, hostId, otherTargetId, attackerId } = setup();

      expectFailure(p2.enterBattle(attackerId, otherTargetId), "INVALID_TARGET");
      expectFailure(p2.enterBattle(attackerId, "direct"), "INVALID_TARGET");
      expectSuccess(p2.enterBattle(attackerId, hostId));
    });

    it("does not restrict an enemy Link Unit", () => {
      const { p2, otherTargetId, attackerId } = setup({ linkAttacker: true });

      expectSuccess(p2.enterBattle(attackerId, otherTargetId));
    });

    it("does not restrict attacks when Kayra is paired but not linked", () => {
      const { p2, otherTargetId, attackerId } = setup({ linked: false });

      expectSuccess(p2.enterBattle(attackerId, otherTargetId));
    });

    it("does not restrict attacks while Kayra's linked Unit is active", () => {
      const { p2, otherTargetId, attackerId } = setup({ rested: false });

      expectSuccess(p2.enterBattle(attackerId, otherTargetId));
    });
  });
});
