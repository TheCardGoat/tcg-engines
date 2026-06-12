import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st01AmuroRay010 } from "./010-amuro-ray.ts";

describe("Amuro Ray (ST01-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st01AmuroRay010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Paired】 rests a chosen enemy Unit with 5 or less HP", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const enemy = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [st01AmuroRay010],
        play: [unit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st01AmuroRay010, unitId));

    // Triggered target auto-picks the only legal enemy; resolve if it halted.
    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    expect(p1.isExhausted(enemyId)).toBe(true);
  });

  it("【When Paired】 does not rest an enemy Unit with HP > 5", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const tough = createMockUnit({ ap: 3, hp: 7 });
    const engine = GundamTestEngine.create(
      {
        hand: [st01AmuroRay010],
        play: [unit],
        resourceArea: activeResources(4),
        deck: 5,
      },
      { play: [tough], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const toughId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st01AmuroRay010, unitId));

    // No legal target → triggered directive doesn't halt, no rest.
    expect(p1.isExhausted(toughId)).toBe(false);
  });
});
