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
import { gd04LoranCehack097 } from "./097-loran-cehack.ts";

describe("Loran Cehack (GD04-097)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04LoranCehack097] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("returns an enemy Unit with 3 or less HP to hand when linked", () => {
    const host = createMockUnit({ linkCondition: "[Loran Cehack]" } as unknown as Parameters<
      typeof createMockUnit
    >[0]);
    const lowHpEnemy = createMockUnit({ hp: 3 });
    const highHpEnemy = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04LoranCehack097],
        play: [host],
        resourceArea: activeResources(5),
      },
      {
        play: [lowHpEnemy, highHpEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId] = p1.getCardsInZone("battleArea");
    const [lowHpEnemyId, highHpEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd04LoranCehack097, hostId!));

    expect(p2.getHand()).toContain(lowHpEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(highHpEnemyId);
  });
});
