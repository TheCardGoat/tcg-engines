import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04IzumaColony126 } from "./126-izuma-colony.ts";

describe("Izuma Colony (GD04-126)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04IzumaColony126],
      resourceArea: activeResources(1),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04IzumaColony126));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04IzumaColony126] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04IzumaColony126);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  describe("When this Base receives battle damage from an enemy Unit with 3 or less AP, deal 1 damage to that Unit.", () => {
    it("deals 1 damage to the attacking Unit after receiving battle damage from a 3 AP Unit", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { baseSection: [gd04IzumaColony126], deck: 5 },
      );
      const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
      const baseId = engine.asPlayer(PLAYER_TWO).getCardsInZone("baseSection")[0]!;

      expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

      expect(getDamageCounter(engine, baseId)).toBe(3);
      expect(getDamageCounter(engine, attackerId)).toBe(1);
    });

    it("does not deal damage back when battle damage came from a 4 AP Unit", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { baseSection: [gd04IzumaColony126], deck: 5 },
      );
      const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

      expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

      expect(getDamageCounter(engine, attackerId)).toBe(0);
    });
  });
});
