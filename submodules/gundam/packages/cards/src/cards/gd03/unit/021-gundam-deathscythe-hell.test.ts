import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamDeathscytheHell021 } from "./021-gundam-deathscythe-hell.ts";

describe("Gundam Deathscythe Hell (GD03-021)", () => {
  it("【Deploy】 grants a G Team Unit permission to attack active enemy Units this turn", () => {
    const ally = createMockUnit({ traits: ["g team"] });
    const activeEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamDeathscytheHell021],
        play: [ally],
        resourceArea: activeResources(8),
        deck: 5,
      },
      { play: [activeEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p1.getLegalAttackTargets(allyId)).not.toContain(enemyId);

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));

    expect(p1.getLegalAttackTargets(allyId)).toContain(enemyId);
  });

  it("removes the active-enemy attack option when the turn ends", () => {
    const ally = createMockUnit({ traits: ["g team"] });
    const activeEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamDeathscytheHell021],
        play: [ally],
        resourceArea: activeResources(8),
        deck: 5,
      },
      { play: [activeEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));
    expect(p1.getLegalAttackTargets(allyId)).toContain(enemyId);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p1.getLegalAttackTargets(allyId)).not.toContain(enemyId);
  });

  it("also grants the option to an Operation Meteor Unit", () => {
    const ally = createMockUnit({ traits: ["operation meteor"] });
    const activeEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamDeathscytheHell021],
        play: [ally],
        resourceArea: activeResources(8),
      },
      { play: [activeEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));

    expect(p1.getLegalAttackTargets(allyId)).toContain(enemyId);
  });

  it("rejects a friendly Unit outside Operation Meteor and G Team", () => {
    const ally = createMockUnit({ traits: ["tekkadan"] });
    const activeEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd03GundamDeathscytheHell021],
        play: [ally],
        resourceArea: activeResources(8),
      },
      { play: [activeEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }),
      "INVALID_TARGET",
    );
  });
});
