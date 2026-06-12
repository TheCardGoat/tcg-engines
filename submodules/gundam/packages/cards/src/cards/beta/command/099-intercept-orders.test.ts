import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  asPlayerId,
  expectSuccess,
  createMockUnit,
  activeResources,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaInterceptOrders099 } from "./099-intercept-orders.ts";
describe("Intercept Orders (GD01-099, beta reprint)", () => {
  it("【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    const u1 = createMockUnit({ ap: 1, hp: 5 });
    const u2 = createMockUnit({ ap: 1, hp: 6 });
    const engine = GundamTestEngine.create({ play: [u1, u2] }, { deck: [betaInterceptOrders099] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaInterceptOrders099.cardNumber, asPlayerId(PLAYER_TWO));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const [u1Id, u2Id] = p1.getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId);

    // 5-HP unit is eligible and gets rested; 6-HP unit is filtered out.
    expect(engine.getG().exhausted[u1Id!]).toBe(true);
    expect(engine.getG().exhausted[u2Id!] ?? false).toBe(false);
  });

  describe("【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.", () => {
    it("rests one chosen enemy unit", () => {
      const u1 = createMockUnit({ ap: 1, hp: 3 });
      const u2 = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [betaInterceptOrders099], resourceArea: activeResources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(betaInterceptOrders099, { targets: [u1Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!] ?? false).toBe(false);
    });

    it("rests two chosen enemy units", () => {
      const u1 = createMockUnit({ ap: 1, hp: 3 });
      const u2 = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [betaInterceptOrders099], resourceArea: activeResources(4) },
        { play: [u1, u2] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [u1Id, u2Id] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(betaInterceptOrders099, { targets: [u1Id!, u2Id!] }));
      expect(engine.getG().exhausted[u1Id!]).toBe(true);
      expect(engine.getG().exhausted[u2Id!]).toBe(true);
    });
  });
});
