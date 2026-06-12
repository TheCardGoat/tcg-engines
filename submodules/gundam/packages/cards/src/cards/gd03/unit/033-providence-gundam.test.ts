import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03ProvidenceGundam033 } from "./033-providence-gundam.ts";

describe("Providence Gundam (GD03-033)", () => {
  it("【During Pair･(ZAFT) Pilot】 gives all friendly ZAFT Units AP+2 during your turn", () => {
    const rau = createMockPilot({ traits: ["zaft"], name: "Rau Le Creuset", apBonus: 0 });
    const zaftAlly = createMockUnit({ traits: ["zaft"], ap: 2, hp: 4 });
    const nonZaft = createMockUnit({ traits: ["clan"], ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [rau],
      play: [gd03ProvidenceGundam033, zaftAlly, nonZaft],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [providenceId, zaftAllyId, nonZaftId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(rau, providenceId!));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(providenceId!, engine.getG(), framework.cards, framework).ap).toBe(7);
    expect(getEffectiveStats(zaftAllyId!, engine.getG(), framework.cards, framework).ap).toBe(4);
    expect(getEffectiveStats(nonZaftId!, engine.getG(), framework.cards, framework).ap).toBe(2);
  });

  describe("【Attack】Choose 1 enemy Unit. Deal 1 damage to it for each 4 AP this Unit has.", () => {
    it("deals 2 damage when Providence has 8 effective AP", () => {
      const rau = createMockPilot({
        traits: ["zaft"],
        name: "Rau Le Creuset",
        apBonus: 1,
        cost: 1,
      });
      const enemy = createMockUnit({ ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [rau],
          play: [gd03ProvidenceGundam033],
          resourceArea: activeResources(7),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [providenceId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.assignPilot(rau, providenceId!));

      expectSuccess(p1.enterBattle(providenceId!, enemyId!));
      if (engine.getPendingChoice()) expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(2);
    });

    it("deals 1 damage when Providence has 5 AP", () => {
      const enemy = createMockUnit({ ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [gd03ProvidenceGundam033] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [providenceId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(providenceId!, enemyId!));
      if (engine.getPendingChoice()) expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
    });
  });
});
