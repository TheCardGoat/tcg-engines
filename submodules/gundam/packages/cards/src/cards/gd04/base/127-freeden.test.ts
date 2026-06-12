import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Freeden127 } from "./127-freeden.ts";

describe("Freeden II (GD04-127)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Freeden127],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Freeden127));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04Freeden127] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04Freeden127);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("destroys an enemy Unit with 2 or less AP when 7 Vulture cards are in trash", () => {
    const vultureTrash = Array.from({ length: 7 }, (_, i) =>
      createMockUnit({ cardNumber: `TEST-VULTURE-${i}`, traits: ["vulture"] }),
    );
    const weakEnemy = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Freeden127],
        trash: vultureTrash,
        resourceArea: activeResources(4),
        deck: 4,
      },
      { play: [weakEnemy] },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd04Freeden127, { targets: [enemyId] }));

    expect(engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")).not.toContain(enemyId);
  });
});
