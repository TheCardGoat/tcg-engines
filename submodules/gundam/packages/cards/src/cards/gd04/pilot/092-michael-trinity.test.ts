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
import { gd04MichaelTrinity092 } from "./092-michael-trinity.ts";

describe("Michael Trinity (GD04-092)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04MichaelTrinity092] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("deals 1 damage to a damaged enemy Unit when linked", () => {
    const host = createMockUnit({ linkCondition: "[Michael Trinity]" } as unknown as Parameters<
      typeof createMockUnit
    >[0]);
    const damagedEnemy = createMockUnit({ hp: 5 });
    const freshEnemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04MichaelTrinity092],
        play: [host],
        resourceArea: activeResources(5),
      },
      {
        play: [damagedEnemy, freshEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId] = p1.getCardsInZone("battleArea");
    const [damagedEnemyId, freshEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    engine.getG().damage[damagedEnemyId!] = 1;

    expectSuccess(p1.assignPilot(gd04MichaelTrinity092, hostId!));

    expect(engine.getG().damage[damagedEnemyId!] ?? 0).toBe(2);
    expect(engine.getG().damage[freshEnemyId!] ?? 0).toBe(0);
  });
});
