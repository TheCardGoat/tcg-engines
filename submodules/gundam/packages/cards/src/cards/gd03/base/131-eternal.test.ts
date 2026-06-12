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
import { gd03Eternal131 } from "./131-eternal.ts";

describe("Eternal (GD03-131)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Eternal131] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Eternal131);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds a shield to hand and returns a Lv.4 or lower enemy when you have 2 TSA Units", () => {
    const tsaA = createMockUnit({ traits: ["triple ship alliance"] });
    const tsaB = createMockUnit({ traits: ["triple ship alliance"] });
    const lowEnemy = createMockUnit({ level: 4 });
    const highEnemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Eternal131],
        play: [tsaA, tsaB],
        resourceArea: activeResources(5),
        deck: 6,
      },
      { play: [lowEnemy, highEnemy] },
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03Eternal131, { targets: [lowEnemyId!] }));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p2.getCardsInZone("hand")).toContain(lowEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(highEnemyId);
  });

  it("【Deploy】 skips the return clause with fewer than 2 Triple Ship Alliance Units", () => {
    const tsa = createMockUnit({ traits: ["triple ship alliance"] });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03Eternal131], play: [tsa], resourceArea: activeResources(5), deck: 6 },
      { play: [enemy] },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd03Eternal131));

    expect(engine.getPendingChoice()).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });
});
