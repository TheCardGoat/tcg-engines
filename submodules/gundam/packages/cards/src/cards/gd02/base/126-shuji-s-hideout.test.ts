import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
  createMockUnit,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd02ShujiSHideout126 } from "./126-shuji-s-hideout.ts";

describe("Shuji's Hideout (GD02-126)", () => {
  it("【Deploy】 adds the top shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      {
        hand: [gd02ShujiSHideout126],
        resourceArea: activeResources(3),
        deck: 6,
      },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    expectSuccess(p1.deployBase(gd02ShujiSHideout126));

    // Top shield moved to hand; net hand delta is zero
    // (base left hand on deploy, shield entered hand via the triggered effect).
    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getHand().length).toBe(handBefore);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_ONE })).not.toContain(
      shieldIds[0],
    );
    // Base is in the baseSection.
    expect(engine.getCardsInZone({ zone: "baseSection", playerId: PLAYER_ONE }).length).toBe(1);
  });

  it("【Burst】 Deploy this card — flips Shuji's Hideout into baseSection", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd02ShujiSHideout126] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd02ShujiSHideout126);
    engine.fireShieldBurst(shieldId);
    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Destroyed】 deals 1 damage to a <=Lv.4 enemy Unit when destroyed", () => {
    // Place Shuji's Hideout in baseSection for P1, and a Lv.4 unit for P2.
    const enemyUnit = createMockUnit({ ap: 2, hp: 5, level: 4 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd02ShujiSHideout126],
        deck: 5,
      },
      { play: [enemyUnit], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Destroy the base using the destroyUnit harness helper.
    engine.destroyUnit(baseId);

    // The destroyed trigger should deal 1 damage to the enemy Lv.4 unit.
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });
});
