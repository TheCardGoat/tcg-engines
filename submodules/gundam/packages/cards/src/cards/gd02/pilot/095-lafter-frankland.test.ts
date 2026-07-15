import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02LafterFrankland095 } from "./095-lafter-frankland.ts";

describe("Lafter Frankland (GD02-095)", () => {
  it("【Burst】Add this card to your hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02LafterFrankland095] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】 grants the damaged paired unit <High-Maneuver> for the battle", () => {
    // selfIsDamaged rebinds to the paired unit (rule 3-3-9-1). The printed
    // "Lv.5 or lower" gate is NOT encoded — only the damage condition gates
    // the grant.
    const host = createMockUnit({
      ap: 3,
      hp: 5,
      level: 4,
      cost: 2,
    });
    const enemy = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { hand: [host, gd02LafterFrankland095], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd02LafterFrankland095, host));

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    // Damage the paired unit so selfIsDamaged resolves true at attack time.
    engine.getG().damage[attackerId] = 1;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(host, enemyId));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    const stats = getEffectiveStats(attackerId, engine.getG(), framework.cards, framework);
    expect(stats.keywords).toContain("HighManeuver");
  });
});
