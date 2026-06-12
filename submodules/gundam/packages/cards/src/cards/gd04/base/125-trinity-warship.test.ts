import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  getDamageCounter,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04TrinityWarship125 } from "./125-trinity-warship.ts";

describe("Trinity Warship (GD04-125)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04TrinityWarship125],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04TrinityWarship125));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04TrinityWarship125] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04TrinityWarship125);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  describe("【Activate･Main】【Once per Turn】①, rest 1 friendly (CB) Unit：Choose 1 enemy Unit that is Lv.5 or lower. Deal 1 damage to it.", () => {
    it("pays 1 and rests a friendly CB Unit to deal 1 damage to an enemy Lv.5 or lower Unit", () => {
      const costUnit = createMockUnit({ traits: ["cb"] });
      const enemy = createMockUnit({ level: 5, hp: 3 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [costUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const costUnitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }));

      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
      expect(p1.isExhausted(costUnitId)).toBe(true);
      expect(getDamageCounter(engine, enemyId)).toBe(1);
    });

    it("cannot activate without an active friendly CB Unit", () => {
      const wrongTrait = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 5 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [wrongTrait],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects enemy Units above Lv.5", () => {
      const costUnit = createMockUnit({ traits: ["cb"] });
      const enemy = createMockUnit({ level: 6 });
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd04TrinityWarship125],
          play: [costUnit],
          resourceArea: activeResources(1),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04TrinityWarship125, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
    });
  });
});
