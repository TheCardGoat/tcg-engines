import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st06RedGundam005 } from "./005-red-gundam.ts";

describe("Red Gundam (ST06-005)", () => {
  describe("<Breach 1> and 【Attack】Choose 1 to 2 friendly (Clan) Units. They get AP+2 during this turn.", () => {
    it("buffs two chosen friendly Clan Units on attack", () => {
      const ally = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st06RedGundam005, ally] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [redId, allyId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(redId!, enemyId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: redId,
        minTargets: 1,
        maxTargets: 2,
      });
      expectSuccess(p1.resolveEffect({ targets: [redId!, allyId!] }));

      expect(p1.getVisibleCard(redId!)?.effectiveAp).toBe(6);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(4);
    });
  });
});
