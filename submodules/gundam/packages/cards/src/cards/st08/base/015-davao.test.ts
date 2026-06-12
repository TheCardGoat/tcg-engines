import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st08Davao015 } from "./015-davao.ts";

describe("Davao (ST08-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Davao from shieldArea into baseSection", () => {
      const engine = GundamTestEngine.create({}, { deck: [st08Davao015] });
      const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st08Davao015);

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `baseSection:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves the first shield to hand and deploys Davao to baseSection", () => {
      const engine = GundamTestEngine.create(
        { hand: [st08Davao015], resourceArea: activeResources(3), deck: 4 },
        {},
      );
      const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st08Davao015));

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getHand()).toHaveLength(handBefore);
      expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
        shieldIds[1],
      ]);
      expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE })).toHaveLength(1);
    });
  });

  describe("【Activate·Main】【Once per Turn】②：Choose 1 of your Units. It recovers 2 HP.", () => {
    it("data encodes a once-per-turn activated recover effect with resource cost", () => {
      const effect = st08Davao015.effects?.[2];
      expect(effect?.type).toBe("activated");
      expect(effect?.activation).toEqual({
        timing: ["activate:main"],
        restrictions: [{ type: "oncePerTurn" }],
      });
      expect(effect?.cost).toEqual({ payResources: 2 });
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "recoverHP",
            amount: 2,
            target: { owner: "friendly", cardType: "unit", count: 1 },
          },
        },
      ]);
    });

    it("recovers 2 damage from the chosen friendly Unit", () => {
      const damaged = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [st08Davao015],
          play: [damaged],
          resourceArea: activeResources(3),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[unitId] = 3;

      expectSuccess(p1.activateBaseAbility(st08Davao015, { targets: [unitId] }));

      expect(getDamageCounter(engine, unitId)).toBe(1);
    });

    it("rejects an enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { baseSection: [st08Davao015], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateBaseAbility(st08Davao015, { targets: [enemyId] }), "ILLEGAL_TARGET");
    });

    it("cannot activate without two payable resources", () => {
      const damaged = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { baseSection: [st08Davao015], play: [damaged], resourceArea: activeResources(1) },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st08Davao015, { targets: [unitId] }),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
