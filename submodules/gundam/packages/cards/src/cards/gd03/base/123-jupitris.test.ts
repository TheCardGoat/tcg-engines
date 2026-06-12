import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Jupitris123 } from "./123-jupitris.ts";

describe("Jupitris (GD03-123)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Jupitris123] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Jupitris123);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds a shield to hand and rests a Lv.3 or lower enemy with a friendly Jupitris Unit", () => {
    const ally = createMockUnit({ traits: ["jupitris"] });
    const lowEnemy = createMockUnit({ level: 3 });
    const highEnemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Jupitris123],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 6,
      },
      { play: [lowEnemy, highEnemy] },
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [lowEnemyId, highEnemyId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03Jupitris123, { targets: [lowEnemyId!] }));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(engine.getG().exhausted[lowEnemyId!]).toBe(true);
    expect(engine.getG().exhausted[highEnemyId!]).not.toBe(true);
  });

  it("【Deploy】 skips the rest clause when no friendly Jupitris Unit is in play", () => {
    const ally = createMockUnit({ traits: ["titans"] });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Jupitris123],
        play: [ally],
        resourceArea: activeResources(3),
        deck: 6,
      },
      { play: [enemy] },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd03Jupitris123));

    expect(engine.getPendingChoice()).toBeUndefined();
    expect(engine.getG().exhausted[enemyId]).not.toBe(true);
  });
});
