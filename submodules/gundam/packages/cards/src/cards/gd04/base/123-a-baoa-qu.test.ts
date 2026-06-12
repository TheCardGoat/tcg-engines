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
import { gd04ABaoaQu123 } from "./123-a-baoa-qu.ts";

describe("A Baoa Qu (GD04-123)", () => {
  it("【Deploy】 adds 1 shield to hand", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04ABaoaQu123],
      resourceArea: activeResources(5),
      deck: 4,
    });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd04ABaoaQu123));

    expect(p1.getHand()).toContain(shieldId);
  });

  it("【Burst】 deploys this card from shield area", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd04ABaoaQu123] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd04ABaoaQu123);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("data gates battle-damage prevention on a rested friendly Zeon Unit", () => {
    const effect = gd04ABaoaQu123.effects?.[2];
    expect(effect?.activation.conditions).toEqual([
      {
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "zeon",
        state: "rested",
      },
    ]);
  });

  it("while a rested friendly Zeon Unit is in play, prevents battle damage from enemy Lv.4 or lower Units", () => {
    const zeonUnit = createMockUnit({ traits: ["zeon"] });
    const attacker = createMockUnit({ level: 4, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd04ABaoaQu123], play: [{ card: zeonUnit, exhausted: true }], deck: 5 },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

    expect(p1.getDamage(baseId)).toBe(0);
  });

  it("does not prevent battle damage from enemy Lv.5 Units", () => {
    const zeonUnit = createMockUnit({ traits: ["zeon"] });
    const attacker = createMockUnit({ level: 5, ap: 3 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd04ABaoaQu123], play: [{ card: zeonUnit, exhausted: true }], deck: 5 },
      { play: [attacker], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    engine.endTurn();
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.resolveCombat({ attackerId, target: "direct" }));

    expect(p1.getDamage(baseId)).toBe(3);
  });
});
