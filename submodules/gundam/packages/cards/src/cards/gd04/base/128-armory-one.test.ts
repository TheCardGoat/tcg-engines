import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04ArmoryOne128 } from "./128-armory-one.ts";

describe("Armory One (GD04-128)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04ArmoryOne128],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04ArmoryOne128));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04ArmoryOne128] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04ArmoryOne128);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Destroyed】 all players draw 1", () => {
    const engine = GundamTestEngine.create(
      { baseSection: [gd04ArmoryOne128], deck: 2 },
      { deck: 2 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    const p1HandBefore = p1.getCardsInZone("hand").length;
    const p2HandBefore = p2.getCardsInZone("hand").length;

    engine.destroyUnit(baseId);

    expect(p1.getCardsInZone("hand")).toHaveLength(p1HandBefore + 1);
    expect(p2.getCardsInZone("hand")).toHaveLength(p2HandBefore + 1);
  });
});
