import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd04GundamExia038 } from "./038-gundam-exia.ts";

describe("Gundam Exia (GD04-038)", () => {
  it("【Deploy】 deals 2 damage to a chosen enemy Unit (Lv.2 or lower) when 2+ enemy Units are in play", () => {
    const enemyA = createMockUnit({ ap: 1, hp: 5, level: 2 });
    const enemyB = createMockUnit({ ap: 1, hp: 5, level: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamExia038],
        resourceArea: activeResources(3),
      },
      { play: [enemyA, enemyB] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyAId, enemyBId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04GundamExia038, { targets: [enemyAId!] }));

    expect(getDamageCounter(engine, enemyAId!)).toBe(2);
    expect(getDamageCounter(engine, enemyBId!)).toBe(0);
  });

  it("【Deploy】 does NOT damage anyone when fewer than 2 enemy Units are in play", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5, level: 2 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamExia038],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04GundamExia038));

    expect(getDamageCounter(engine, enemyId)).toBe(0);
  });
});
