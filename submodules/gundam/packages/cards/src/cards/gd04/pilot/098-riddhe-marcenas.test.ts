import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  executeCardEffect,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd04RiddheMarcenas098 } from "./098-riddhe-marcenas.ts";

const effectDamage: CardEffect = {
  type: "command",
  activation: { timing: ["action"] },
  directives: [
    {
      action: {
        action: "dealDamage",
        amount: 4,
        target: { owner: "any", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Deal 4 effect damage to 1 Unit.",
};

describe("Riddhe Marcenas (GD04-098)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04RiddheMarcenas098] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【During Link】When this Unit receives effect damage from an enemy, reduce it by 2.", () => {
    function setup(linkCondition = "[Riddhe Marcenas]") {
      const host = createMockUnit({ name: "Riddhe Host", hp: 10, linkCondition });
      const enemy = createMockUnit({ name: "Enemy Source", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04RiddheMarcenas098],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04RiddheMarcenas098, hostId));

      return { engine, hostId, enemyId };
    }

    function dealEffectDamage(
      engine: GundamTestEngine,
      sourcePlayerId: string,
      sourceCardId: string,
      targetCardId: string,
    ) {
      engine.getRuntime().runTestMutation(sourcePlayerId as PlayerId, ({ G, framework }) => {
        executeCardEffect(effectDamage, {
          G,
          framework,
          sourcePlayerId,
          sourceCardId,
          chosenTargets: [targetCardId],
        });
      });
    }

    it("reduces enemy effect damage to the linked Unit by 2", () => {
      const { engine, hostId, enemyId } = setup();

      dealEffectDamage(engine, PLAYER_TWO, enemyId, hostId);

      expect(getDamageCounter(engine, hostId)).toBe(2);
    });

    it("does not consume the constant reduction after one damage event", () => {
      const { engine, hostId, enemyId } = setup();

      dealEffectDamage(engine, PLAYER_TWO, enemyId, hostId);
      dealEffectDamage(engine, PLAYER_TWO, enemyId, hostId);

      expect(getDamageCounter(engine, hostId)).toBe(4);
    });

    it("does not reduce friendly effect damage", () => {
      const { engine, hostId } = setup();

      dealEffectDamage(engine, PLAYER_ONE, hostId, hostId);

      expect(getDamageCounter(engine, hostId)).toBe(4);
    });

    it("does not reduce damage while paired but not linked", () => {
      const { engine, hostId, enemyId } = setup("[Different Pilot]");

      dealEffectDamage(engine, PLAYER_TWO, enemyId, hostId);

      expect(getDamageCounter(engine, hostId)).toBe(4);
    });
  });
});
