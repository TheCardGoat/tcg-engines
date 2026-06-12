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
import { st06GquuuuuuxOmegaPsycommu002 } from "./002-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (ST06-002)", () => {
  it("【Deploy】 deals 1 damage to a chosen enemy Unit", () => {
    const clanAlly = createMockUnit({ ap: 2, hp: 2, traits: ["clan"] });
    const enemy = createMockUnit({ ap: 3, hp: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [st06GquuuuuuxOmegaPsycommu002],
        play: [clanAlly],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002, { targets: [enemyId] }));

    expect(getDamageCounter(engine, enemyId)).toBe(1);
  });

  it("【Deploy】 without another friendly (Clan) Unit, dealDamage does NOT fire", () => {
    const enemy = createMockUnit({ ap: 3, hp: 4 });
    // No other friendly Clan unit in play — condition should fail.
    const engine = GundamTestEngine.create(
      {
        hand: [st06GquuuuuuxOmegaPsycommu002],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Deploy should succeed (the unit itself deploys) but the effect should NOT fire.
    expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002));

    // No damage should have been dealt.
    expect(getDamageCounter(engine, enemyId)).toBe(0);
  });
});
