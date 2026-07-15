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
import { gd04Gundam073 } from "./073-gundam.ts";

describe("∀ Gundam (GD04-073)", () => {
  describe("【Activate･Main】【Once per Turn】①：This Unit gets AP+2 during this turn.", () => {
    it("pays 1 resource, shows AP+2, and uses that AP to destroy a 5 HP Unit", () => {
      const defender = createMockUnit({ ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd04Gundam073],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourceId = p1.getCardsInZone("resourceArea")[0]!;

      expectSuccess(p1.activateAbility(unitId, 0));

      expect(p1.isExhausted(resourceId)).toBe(true);
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(5);
      expectFailure(p1.activateAbility(unitId, 0), "ABILITY_LIMIT_REACHED");

      expectSuccess(p1.enterBattle(unitId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });
});
