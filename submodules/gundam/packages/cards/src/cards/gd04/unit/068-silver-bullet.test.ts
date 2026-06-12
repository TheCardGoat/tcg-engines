import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  executeCardEffect,
  getDamageCounter,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd04SilverBullet068 } from "./068-silver-bullet.ts";

const effectDamage: CardEffect = {
  type: "command",
  activation: { timing: ["action"] },
  directives: [
    {
      action: {
        action: "dealDamage",
        amount: 5,
        target: { owner: "any", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Deal 5 effect damage to 1 Unit.",
};

describe("Silver Bullet (GD04-068)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04SilverBullet068.keywordEffects.map((effect) => effect.keyword)).toEqual(["Blocker"]);
  });

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

  it("reduces enemy effect damage to itself by 3", () => {
    const enemy = createMockUnit({ name: "Enemy Source", hp: 10 });
    const engine = GundamTestEngine.create({ play: [gd04SilverBullet068] }, { play: [enemy] });
    const silverBulletId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    dealEffectDamage(engine, PLAYER_TWO, enemyId, silverBulletId);

    expect(getDamageCounter(engine, silverBulletId)).toBe(2);
  });

  it("limits the damage reduction to enemy sources", () => {
    expect(gd04SilverBullet068.effects?.[0]?.directives[0]).toMatchObject({
      action: {
        action: "reduceNextDamage",
        source: "enemy",
      },
    });
  });
});
