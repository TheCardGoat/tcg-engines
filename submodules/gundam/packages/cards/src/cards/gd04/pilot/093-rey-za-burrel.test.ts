import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  activeResources,
  createMockUnit,
  executeCardEffect,
  getDamageCounter,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd04ReyZaBurrel093 } from "./093-rey-za-burrel.ts";

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

describe("Rey Za Burrel (GD04-093)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04ReyZaBurrel093] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【When Linked】reduces the next damage to a friendly ZAFT Link Unit by 2", () => {
    const host = createMockUnit({
      name: "ZAFT Link Host",
      traits: ["zaft"],
      linkCondition: "[Rey Za Burrel]",
      // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
    } as any);
    const enemy = createMockUnit({ name: "Enemy Source", hp: 10 });
    const engine = GundamTestEngine.create(
      { play: [host], hand: [gd04ReyZaBurrel093], resourceArea: activeResources(4) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04ReyZaBurrel093, hostId));
    dealEffectDamage(engine, PLAYER_TWO, enemyId, hostId);

    expect(getDamageCounter(engine, hostId)).toBe(3);
  });
});
