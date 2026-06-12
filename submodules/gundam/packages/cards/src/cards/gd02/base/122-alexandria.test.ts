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
import { gd02Alexandria122 } from "./122-alexandria.ts";

describe("Alexandria (GD02-122)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Alexandria122], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Alexandria122));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Alexandria into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Alexandria122] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Alexandria122);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 deals 1 damage to a chosen rested enemy Unit Lv.4 or lower", () => {
    const rested = createMockUnit({ name: "Rested Low", ap: 2, hp: 3, level: 3, cost: 2 });
    const active = createMockUnit({ name: "Active Low", ap: 2, hp: 3, level: 3, cost: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd02Alexandria122], resourceArea: activeResources(6), deck: 6 },
      { play: [{ card: rested, exhausted: true }, active], deck: 5 },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [restedId, activeId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd02Alexandria122));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [restedId!] }));
    }

    expect(getDamageCounter(engine, restedId!)).toBe(1);
    expect(getDamageCounter(engine, activeId!)).toBe(0);
  });
});
