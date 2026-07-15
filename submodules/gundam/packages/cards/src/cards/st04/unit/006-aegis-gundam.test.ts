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
import { st04AegisGundam006 } from "./006-aegis-gundam.ts";

describe("Aegis Gundam (ST04-006)", () => {
  describe("【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.", () => {
    it("deals 3 damage to a Lv.5 enemy Unit when Aegis has 5 AP", () => {
      const athrun = createMockPilot({ name: "Athrun Zala", level: 1, cost: 1, apBonus: 1 });
      const enemy = createMockUnit({ ap: 2, hp: 6, level: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [athrun],
          play: [st04AegisGundam006],
          resourceArea: activeResources(4),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aegisId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(athrun, st04AegisGundam006));

      expectSuccess(p1.enterBattle(aegisId!, enemyId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: aegisId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getDamage(enemyId!)).toBe(3);
    });

    it("does not deal effect damage when Aegis has only 4 AP", () => {
      const enemy = createMockUnit({ ap: 2, hp: 6, level: 5 });
      const engine = GundamTestEngine.create(
        { play: [st04AegisGundam006] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [aegisId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(aegisId!, enemyId!));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId!)).toBe(0);
    });
  });
});
