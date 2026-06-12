import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03FieldDirective103 } from "./103-field-directive.ts";

describe("Field Directive (GD03-103)", () => {
  it("【Burst】 rests an enemy Unit with 2 or less HP", () => {
    const fragile = createMockUnit({ hp: 2 });
    const sturdy = createMockUnit({ hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [fragile, sturdy] },
      { deck: [gd03FieldDirective103] },
    );
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd03FieldDirective103.cardNumber, asPlayerId(PLAYER_TWO));
    const [fragileId, sturdyId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");

    engine.fireShieldBurst(shieldId, { targets: [fragileId!] });

    expect(engine.getG().exhausted[fragileId!]).toBe(true);
    expect(engine.getG().exhausted[sturdyId!]).not.toBe(true);
  });

  it("【Main】 deals 2 damage to a rested enemy Unit when 3 or more enemy Units are in play", () => {
    const rested = { card: createMockUnit({ hp: 4 }), exhausted: true };
    const activeA = createMockUnit({ hp: 4 });
    const activeB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03FieldDirective103], resourceArea: activeResources(4) },
      { play: [rested, activeA, activeB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const restedId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03FieldDirective103, { targets: [restedId] }));

    expect(getDamageCounter(engine, restedId)).toBe(2);
  });

  it("【Main】 rejects an active enemy Unit target for the damage clause", () => {
    const rested = { card: createMockUnit({ hp: 4 }), exhausted: true };
    const activeA = createMockUnit({ hp: 4 });
    const activeB = createMockUnit({ hp: 4 });
    const engine = GundamTestEngine.create(
      { hand: [gd03FieldDirective103], resourceArea: activeResources(4) },
      { play: [rested, activeA, activeB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const activeId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[1]!;

    expect(p1.playCommand(gd03FieldDirective103, { targets: [activeId] }).success).toBe(false);
  });
});
