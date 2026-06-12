import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getEffectiveStats,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st08Valiant014 } from "./014-valiant.ts";

describe("Valiant (ST08-014)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Valiant from shieldArea into baseSection", () => {
      const engine = GundamTestEngine.create({}, { deck: [st08Valiant014] });
      const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st08Valiant014);

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `baseSection:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 of your Units. It gets AP+2 during this turn.", () => {
    it("data encodes shield-to-hand followed by AP+2 to one friendly Unit", () => {
      const effect = st08Valiant014.effects?.[1];
      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["deploy"]);
      expect(effect?.directives).toEqual([
        { action: { action: "addShieldToHand", count: 1 } },
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 2,
            duration: "thisTurn",
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
        },
      ]);
    });

    it("moves a shield to hand and grants AP+2 to the chosen friendly Unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08Valiant014], play: [unit], resourceArea: activeResources(2), deck: 4 },
        {},
      );
      const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st08Valiant014, { targets: [unitId] }));

      const fw = engine.getRuntime().getFrameworkReadAPI();
      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(getEffectiveStats(unitId, engine.getG(), fw.cards, fw).ap).toBe(4);
      expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE })).toHaveLength(1);
    });

    it("rejects an enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08Valiant014], resourceArea: activeResources(2), deck: 2 },
        { play: [enemy] },
      );
      seedShieldsFromDeck(engine, PLAYER_ONE, 1);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployBase(st08Valiant014, { targets: [enemyId] }), "INVALID_TARGET");
    });
  });
});
