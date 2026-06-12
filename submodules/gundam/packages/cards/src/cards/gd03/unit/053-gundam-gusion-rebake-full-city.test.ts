import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03GundamGusionRebakeFullCity053 } from "./053-gundam-gusion-rebake-full-city.ts";

describe("Gundam Gusion Rebake Full City (GD03-053)", () => {
  it("has Blocker", () => {
    const engine = GundamTestEngine.create({ play: [gd03GundamGusionRebakeFullCity053] });
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const framework = engine.getRuntime().getFrameworkReadAPI();

    expect(getEffectiveStats(unitId, engine.getG(), framework.cards, framework).keywords).toContain(
      "Blocker",
    );
  });

  describe("【During Pair】【Once per Turn】During your turn, when one of your (Tekkadan)/(Teiwaz) Units receives effect damage, choose 1 enemy Unit that is Lv.4 or lower. Rest it.", () => {
    it("rests an enemy Lv.4 or lower Unit when a friendly Tekkadan Unit receives effect damage", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", cost: 1 });
      const damagedUnit = createMockUnit({ traits: ["tekkadan"], hp: 4 });
      const damageCommand = createEffectDamageCommand();
      const enemy = createMockUnit({ level: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, damageCommand],
          play: [gd03GundamGusionRebakeFullCity053, damagedUnit],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const damagedId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamGusionRebakeFullCity053));
      expectSuccess(p1.playCommand(damageCommand, { targets: [damagedId] }));

      expect(p1.getDamage(damagedId)).toBe(1);
      expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(true);
    });

    it("does not trigger when the damaged friendly Unit is not Tekkadan or Teiwaz", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", cost: 1 });
      const damagedUnit = createMockUnit({ traits: ["earth federation"], hp: 4 });
      const damageCommand = createEffectDamageCommand();
      const enemy = createMockUnit({ level: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, damageCommand],
          play: [gd03GundamGusionRebakeFullCity053, damagedUnit],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const damagedId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamGusionRebakeFullCity053));
      expectSuccess(p1.playCommand(damageCommand, { targets: [damagedId] }));

      expect(p1.getDamage(damagedId)).toBe(1);
      expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(false);
    });

    it("does not rest enemy Units above Lv.4", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", cost: 1 });
      const damagedUnit = createMockUnit({ traits: ["teiwaz"], hp: 4 });
      const damageCommand = createEffectDamageCommand();
      const enemy = createMockUnit({ level: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, damageCommand],
          play: [gd03GundamGusionRebakeFullCity053, damagedUnit],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const damagedId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.assignPilot(pilot, gd03GundamGusionRebakeFullCity053));
      expectSuccess(p1.playCommand(damageCommand, { targets: [damagedId] }));

      expect(p1.getDamage(damagedId)).toBe(1);
      expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(false);
    });

    it("does not trigger while unpaired", () => {
      const damagedUnit = createMockUnit({ traits: ["tekkadan"], hp: 4 });
      const damageCommand = createEffectDamageCommand();
      const enemy = createMockUnit({ level: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [damageCommand],
          play: [gd03GundamGusionRebakeFullCity053, damagedUnit],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      const damagedId = p1.getCardsInZone("battleArea")[1]!;

      expectSuccess(p1.playCommand(damageCommand, { targets: [damagedId] }));

      expect(p1.getDamage(damagedId)).toBe(1);
      expect(engine.asPlayer(PLAYER_TWO).isExhausted(enemyId)).toBe(false);
    });
  });
});

function createEffectDamageCommand() {
  return createMockCommand({
    effect: "【Main】Choose 1 Unit. Deal 1 damage to it.",
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner: "any", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 Unit. Deal 1 damage to it.",
      },
    ],
  });
}
