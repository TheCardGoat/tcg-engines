import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st05MikazukiAugus010 } from "./010-mikazuki-augus.ts";

describe("Mikazuki Augus (ST05-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [st05MikazukiAugus010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【When Paired】 deals 1 damage to a chosen enemy Unit", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const enemy = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [st05MikazukiAugus010], play: [unit], resourceArea: activeResources(4), deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(st05MikazukiAugus010, unitId));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});
