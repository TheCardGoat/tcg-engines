import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getContinuousEffects,
  hasGrantAttackTargetOption,
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
      },
      { play: [activeEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));

    expect(hasGrantAttackTargetOption(engine, allyId)).toBe(true);
  });

  it("stores the granted target filter as active enemy Units", () => {
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
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));

    const grant = getContinuousEffects(engine).find(
      (effect) =>
        effect.targetId === allyId && effect.payload.kind === "grant-attack-target-option",
    );
    expect(grant?.payload).toMatchObject({
      kind: "grant-attack-target-option",
      attackTarget: {
        owner: "opponent",
        cardType: "unit",
        state: "active",
      },
    });
  });

  it("does not grant the option to a friendly Unit outside Operation Meteor/G Team", () => {
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

    expectSuccess(p1.deployUnit(gd03GundamDeathscytheHell021, { targets: [allyId] }));

    expect(hasGrantAttackTargetOption(engine, allyId)).toBe(false);
  });
});
