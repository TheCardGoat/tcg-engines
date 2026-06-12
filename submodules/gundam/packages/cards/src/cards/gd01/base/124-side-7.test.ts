import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  createMockUnit,
  createMockResource,
  asPlayerId,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd01Side7124 } from "./124-side-7.ts";

describe("Side 7 (GD01-124)", () => {
  it("【Burst】Deploy this card — flips Side 7 into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01Side7124] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01Side7124.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves 1 shield from shield area to hand when base is deployed", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Side7124],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { deck: 5 },
        { skipToMainPhase: true },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      // Manually add shields (simulate setup shields)
      for (let i = 0; i < 3; i++) {
        engine.giveCard(asPlayerId(PLAYER_ONE), createMockResource().cardNumber, {
          zone: "shieldArea",
          playerId: PLAYER_ONE,
        });
      }

      const shieldsBefore = p1.getCardsInZone("shieldArea").length;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(gd01Side7124));

      // Base should be in baseSection, not battleArea
      expect(p1.getCardsInZone("baseSection").length).toBe(1);
      expect(p1.getCardsInZone("battleArea").length).toBe(0);

      // 1 shield should have moved to hand
      expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);
      // Hand: lost base card (-1), gained shield (+1) = net 0
      expect(p1.getHand().length).toBe(handBefore);
    });

    it("base has correct HP after deployment", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Side7124],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(gd01Side7124));

      const baseId = p1.getCardsInZone("baseSection")[0]!;
      expect(p1.getDamage(baseId)).toBe(0);
    });

    it("does not duplicate shield if no shields remain", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Side7124],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      // No shields added — deploy effect should not crash
      const result = p1.deployBase(gd01Side7124);
      expectSuccess(result);

      // Base still deployed successfully
      expect(p1.getCardsInZone("baseSection").length).toBe(1);
    });
  });

  it("【Activate･Main】Rest this Base：Choose 1 friendly Unit. It recovers 1 HP.", () => {
    const friendlyUnit = createMockUnit({ level: 1, cost: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01Side7124],
        play: [friendlyUnit],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01Side7124));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    // Seed damage on the friendly unit so recoverHP has something to heal.
    // Re-fetch state after each move — the draft returned by getG() is a
    // snapshot, so holding a reference across moves would read stale data.
    engine.getG().damage[unitId] = 3;

    expectSuccess(p1.activateAbility(baseId, 0, { targets: [unitId] }));

    expect(p1.getDamage(unitId)).toBe(2);
    expect(p1.isExhausted(baseId)).toBe(true);
  });

  describe("baseSection zone rules", () => {
    it("rejects deploying a second base when one is already present", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Side7124, gd01Side7124],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      // Deploy first base
      expectSuccess(p1.deployBase(gd01Side7124));
      expect(p1.getCardsInZone("baseSection").length).toBe(1);

      // Try deploying a second base — should fail
      const result = p1.deployBase(gd01Side7124);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("BASE_LIMIT_REACHED");
      }
    });
  });
});
