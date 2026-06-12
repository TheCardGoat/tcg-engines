import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  seedBaseAsShield,
  seedShieldsFromDeck,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Jaburo122 } from "./122-jaburo.ts";

describe("Jaburo (GD04-122)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04Jaburo122],
      resourceArea: activeResources(4),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04Jaburo122));

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04Jaburo122] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04Jaburo122);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  describe("【Activate･Main】【Once per Turn】Rest 1 of your (Earth Federation) Units：Choose 1 enemy Unit that is Lv.3 or lower. Rest it.", () => {
    it("rests a friendly Earth Federation Unit to rest an enemy Lv.3 or lower Unit", () => {
      const costUnit = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [costUnit] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const costUnitId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }));

      expect(p1.isExhausted(costUnitId)).toBe(true);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("cannot activate without an active friendly Earth Federation Unit", () => {
      const wrongTrait = createMockUnit({ traits: ["academy"] });
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [wrongTrait] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }),
        "COST_NOT_PAYABLE",
      );
    });

    it("rejects enemy Units above Lv.3", () => {
      const costUnit = createMockUnit({ traits: ["earth federation"] });
      const enemy = createMockUnit({ level: 4 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd04Jaburo122], play: [costUnit] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(gd04Jaburo122, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
    });
  });
});
