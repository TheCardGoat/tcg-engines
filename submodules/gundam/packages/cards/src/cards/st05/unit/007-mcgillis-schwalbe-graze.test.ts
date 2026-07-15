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
import { st05McgillisSchwalbeGraze007 } from "./007-mcgillis-schwalbe-graze.ts";

describe("McGillis' Schwalbe Graze (ST05-007)", () => {
  describe("<Blocker> and 【When Paired】AP-2 to enemy Lv.3-or-lower", () => {
    it("applies AP-2 to the only enemy Lv.3 Unit when paired", () => {
      const mcgillis = createMockPilot({ name: "McGillis Fareed", level: 1, cost: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 4, level: 3 });
      const engine = GundamTestEngine.create(
        {
          hand: [mcgillis],
          play: [st05McgillisSchwalbeGraze007],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [grazeId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(mcgillis, grazeId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: grazeId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getVisibleCard(enemyId!)?.effectiveAp).toBe(2);
    });

    it("uses Blocker to intercept an attack", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, st05McgillisSchwalbeGraze007] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const blockerId = p2.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.enterBattle(attackerId, defenderId));
      expectSuccess(p2.declareBlock(blockerId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(blockerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(defenderId)).toBe(0);
    });
  });
});
