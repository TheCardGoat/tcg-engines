import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  activeResources,
  findStatModifier,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd02Sleipnir130 } from "./130-sleipnir.ts";

describe("Sleipnir (GD02-130)", () => {
  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd02Sleipnir130], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02Sleipnir130));

    // Top shield enters hand; hand count unchanged (base out, shield in).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).toEqual([
      shieldIds[1],
    ]);
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Sleipnir into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02Sleipnir130] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02Sleipnir130);

    engine.fireShieldBurst(shieldId);

    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 applies AP-2 to a chosen enemy Unit", () => {
    // Printed "if a friendly (Gjallarhorn) Unit is in play" gate is NOT
    // encoded in card data — the AP-2 fires unconditionally.
    const enemy = createMockUnit({ ap: 4, hp: 4, level: 4, cost: 2 });
    const engine = GundamTestEngine.create(
      { hand: [gd02Sleipnir130], resourceArea: activeResources(6), deck: 6 },
      { play: [enemy], deck: 5 },
    );
    seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd02Sleipnir130));

    if (engine.getPendingChoice()) {
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    }

    const mod = findStatModifier(engine, enemyId, "ap");
    expect(mod?.modifier).toBe(-2);
  });
});
