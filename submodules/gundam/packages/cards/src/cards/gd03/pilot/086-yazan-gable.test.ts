import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03YazanGable086 } from "./086-yazan-gable.ts";

describe("Yazan Gable (GD03-086)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03YazanGable086] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  it("【Attack】 gives AP+1 to a friendly (Titans) Unit whose Lv. is equal to or lower than this Unit", () => {
    const host = createMockUnit({
      level: 4,
      ap: 3,
      hp: 5,
      traits: ["earth federation"],
      linkCondition: "[Yazan Gable]",
    });
    const target = createMockUnit({ level: 4, ap: 2, hp: 4, traits: ["titans"] });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      { hand: [host, gd03YazanGable086], play: [target], resourceArea: activeResources(5) },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03YazanGable086, host));
    const [targetId, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId!, defenderId));

    const mod = findStatModifier(engine, targetId!, "ap");
    expect(mod?.modifier).toBe(1);
  });

  it("does not buff a friendly (Titans) Unit whose Lv. is higher than this Unit", () => {
    const host = createMockUnit({
      level: 4,
      ap: 3,
      hp: 5,
      traits: ["earth federation"],
      linkCondition: "[Yazan Gable]",
    });
    const highLevelTarget = createMockUnit({ level: 5, ap: 2, hp: 4, traits: ["titans"] });
    const defender = { card: createMockUnit({ ap: 1, hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      {
        hand: [host, gd03YazanGable086],
        play: [highLevelTarget],
        resourceArea: activeResources(5),
      },
      { play: [defender] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03YazanGable086, host));
    const [highLevelTargetId, attackerId] = p1.getCardsInZone("battleArea");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId!, defenderId));

    expect(findStatModifier(engine, highLevelTargetId!, "ap")).toBeUndefined();
  });
});
