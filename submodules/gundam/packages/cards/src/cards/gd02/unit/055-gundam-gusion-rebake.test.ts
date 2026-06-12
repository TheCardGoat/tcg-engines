import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectAttackRedirectedTo,
  expectSuccess,
  getDamageCounter,
} from "@tcg/gundam-engine";
import { gd02GundamGusionRebake055 } from "./055-gundam-gusion-rebake.ts";

describe("Gundam Gusion Rebake (GD02-055)", () => {
  it("deploy deals 1 damage to a chosen friendly Unit and a chosen enemy Unit", () => {
    const ally = createMockUnit({ hp: 5 });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02GundamGusionRebake055],
        play: [ally],
        resourceArea: activeResources(5),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02GundamGusionRebake055, { targets: [allyId, enemyId] }));

    expect(getDamageCounter(engine, allyId)).toBe(1);
    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });

  it("uses Blocker to intercept an attack", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [defender, gd02GundamGusionRebake055] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(blockerId));

    expectAttackRedirectedTo(engine, blockerId);
  });
});
