import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03PaptimusScirocco084 } from "../pilot/084-paptimus-scirocco.ts";
import { gd03TheO002 } from "./002-the-o.ts";

describe("The-O (GD03-002)", () => {
  it("has printed Repair 3 in effective stats", () => {
    const engine = GundamTestEngine.create({ play: [gd03TheO002] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    const stats = getEffectiveStats(unitId, engine.getG(), framework.cards, framework);

    expect(stats.keywords).toContain("Repair");
  });

  it("rests an enemy Unit whose level is not higher when another friendly Repair Unit attacks", () => {
    const repairAttacker = createMockUnit({
      name: "Repair Attacker",
      level: 3,
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Repair", value: 1 }],
    });
    const legalEnemy = createMockUnit({ name: "Lv.3 Enemy", level: 3, ap: 1, hp: 5 });
    const battleTarget = createMockUnit({ name: "Lv.5 Defender", level: 5, ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TheO002, gd03PaptimusScirocco084],
        play: [repairAttacker],
        resourceArea: activeResources(7),
      },
      { play: [legalEnemy, { card: battleTarget, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03TheO002));
    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, gd03TheO002));

    const [attackerId] = p1.getCardsInZone("battleArea");
    const [legalEnemyId, battleTargetId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    expectSuccess(p1.enterBattle(attackerId!, battleTargetId!));

    expect(engine.getG().exhausted[legalEnemyId!]).toBe(true);
  });

  it("does not rest an enemy Unit when The-O itself attacks", () => {
    const legalEnemy = createMockUnit({ name: "Lv.7 Enemy", level: 7, ap: 1, hp: 8 });
    const battleTarget = createMockUnit({ name: "Battle Target", level: 7, ap: 1, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03TheO002, gd03PaptimusScirocco084],
        resourceArea: activeResources(7),
      },
      { play: [legalEnemy, { card: battleTarget, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(gd03TheO002));
    expectSuccess(p1.assignPilot(gd03PaptimusScirocco084, gd03TheO002));
    const [theOId] = p1.getCardsInZone("battleArea");
    const [legalEnemyId, battleTargetId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(theOId!, battleTargetId!));

    expect(engine.getG().exhausted[legalEnemyId!] ?? false).toBe(false);
  });
});
