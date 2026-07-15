import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st03Rewloola015 } from "./015-rewloola.ts";

describe("Rewloola (ST03-015)", () => {
  it("【Deploy】 adds 1 shield to hand and deals 1 damage to a ≤5 AP enemy", () => {
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [st03Rewloola015], resourceArea: activeResources(3), deck: 6 },
      { play: [enemy] },
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(st03Rewloola015, { targets: [enemyId] }));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });

  it("【Burst】 Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [st03Rewloola015] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, st03Rewloola015);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });
});
