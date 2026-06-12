import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd01ZeeZulu059 } from "./059-zee-zulu.ts";

describe("Zee Zulu (GD01-059)", () => {
  it("【Attack】If you are attacking the enemy player, this Unit gets AP+2 during this battle.", () => {
    // Direct attack (attacking the player) — condition should be met, AP+2 applies.
    const engine = GundamTestEngine.create({ play: [gd01ZeeZulu059], deck: 5 }, { deck: 5 });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId, "direct"));

    const mod = findStatModifier(engine, attackerId, "ap");
    expect(mod).toBeDefined();
    expect(mod!.modifier).toBe(2);
  });

  it("【Attack】does NOT get AP+2 when attacking an enemy Unit (not the player)", () => {
    const enemy = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd01ZeeZulu059], deck: 5 },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.deployedThisTurn = [];

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    const mod = findStatModifier(engine, attackerId, "ap");
    expect(mod).toBeUndefined();
  });
});
