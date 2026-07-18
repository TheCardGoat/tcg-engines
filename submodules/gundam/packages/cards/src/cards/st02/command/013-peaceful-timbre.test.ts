import { describe, expect, it } from "vite-plus/test";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  GundamTestEngine,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st02PeacefulTimbre013 } from "./013-peaceful-timbre.ts";

describe("Peaceful Timbre (ST02-013)", () => {
  describe("【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.", () => {
    it("protects a Base from battle damage dealt by an enemy Lv.4 Unit", () => {
      const attacker = createMockUnit({ level: 4, ap: 3, hp: 5 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [base],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [attacker], deck: 3 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(baseId)).toBe(0);
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
