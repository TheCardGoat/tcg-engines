import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  activeResources,
  getDamageCounter,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02Dominion121 } from "./121-dominion.ts";

describe("Dominion (GD02-121)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Dominion121], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Dominion121));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Dominion into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Dominion121] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Dominion121);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 also recovers 2 HP on a chosen friendly blue Unit", () => {
    const blueUnit = createMockUnit({ ap: 2, hp: 5, level: 3, cost: 2, color: "blue" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Dominion121],
        play: [blueUnit],
        resourceArea: activeResources(6),
        deck: 5,
      },
      {},
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const blueUnitId = p1.getCardsInZone("battleArea")[0]!;
    // Pre-damage the unit so recoverHP is observable.
    engine.getG().damage[blueUnitId] = 2;

    expectSuccess(p1.deployBase(gd02Dominion121));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [blueUnitId] }));
    }

    expect(getDamageCounter(engine, blueUnitId)).toBe(0);
  });
});
