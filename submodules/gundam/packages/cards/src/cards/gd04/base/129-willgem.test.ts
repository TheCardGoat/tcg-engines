import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  getDamageCounter,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Willgem129 } from "./129-willgem.ts";

describe("Willgem (GD04-129)", () => {
  it("【Deploy】 adds 1 shield to hand and deals 3 damage to itself", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Willgem129],
      resourceArea: activeResources(3),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Willgem129));

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    expect(p1.getHand()).toContain(shieldId);
    expect(getDamageCounter(engine, baseId)).toBe(3);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04Willgem129] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04Willgem129);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  describe("【Once per Turn】During your turn, when you pay ① or more for a friendly Unit's effect, this Base recovers 2 HP.", () => {
    it("recovers 2 HP when you pay resources for a friendly Unit's activated effect", () => {
      const unit = createPaidEffectUnit(1);
      const engine = GundamTestEngine.create({
        baseSection: [gd04Willgem129],
        play: [unit],
        resourceArea: activeResources(2),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[baseId] = 3;

      expectSuccess(p1.activateAbility(unitId, 0));

      expect(getDamageCounter(engine, baseId)).toBe(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
    });

    it("does not recover when a Unit effect has no resource payment", () => {
      const unit = createPaidEffectUnit(0);
      const engine = GundamTestEngine.create({
        baseSection: [gd04Willgem129],
        play: [unit],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[baseId] = 3;

      expectSuccess(p1.activateAbility(unitId, 0));

      expect(getDamageCounter(engine, baseId)).toBe(3);
    });

    it("does not recover when resources are paid to play a Command rather than for a Unit effect", () => {
      const command = createMockCommand({
        cost: 1,
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [command],
        baseSection: [gd04Willgem129],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      engine.getG().damage[baseId] = 3;

      expectSuccess(p1.playCommand(command));

      expect(getDamageCounter(engine, baseId)).toBe(3);
    });
  });
});

function createPaidEffectUnit(payResources: number) {
  return createMockUnit({
    cardNumber: `TEST-PAID-UNIT-EFFECT-${payResources}`,
    effects: [
      {
        type: "activated",
        activation: { timing: ["activate:main"] },
        cost: { payResources },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: `【Activate·Main】${payResources > 0 ? "①" : ""}：Draw 1.`,
      },
    ],
  });
}
