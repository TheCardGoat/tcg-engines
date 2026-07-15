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
} from "@tcg/gundam-engine";
import { gd03GundamGusionRebakeFullCity053 } from "./053-gundam-gusion-rebake-full-city.ts";

describe("Gundam Gusion Rebake Full City (GD03-053)", () => {
  it("<Blocker> rests Gusion and redirects an enemy direct attack to it", () => {
    const attacker = createMockUnit({ ap: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamGusionRebakeFullCity053] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gusionId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(gusionId));
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.isExhausted(gusionId)).toBe(true);
    expect(p1.getDamage(gusionId)).toBe(1);
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

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

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

    it("rests at most one enemy Unit per turn", () => {
      const pilot = createMockPilot({ name: "Akihiro Altland", cost: 1 });
      const damagedUnit = createMockUnit({ traits: ["tekkadan"], hp: 5 });
      const firstDamage = createEffectDamageCommand();
      const secondDamage = createEffectDamageCommand();
      const firstEnemy = createMockUnit({ name: "First Enemy", level: 4, hp: 4 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", level: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot, firstDamage, secondDamage],
          play: [gd03GundamGusionRebakeFullCity053, damagedUnit],
          resourceArea: activeResources(5),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const damagedId = p1.getCardsInZone("battleArea")[1]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, gd03GundamGusionRebakeFullCity053));
      expectSuccess(p1.playCommand(firstDamage, { targets: [damagedId] }));
      expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));
      expectSuccess(p1.playCommand(secondDamage, { targets: [damagedId] }));

      expect(p2.isExhausted(firstEnemyId!)).toBe(true);
      expect(p2.isExhausted(secondEnemyId!)).toBe(false);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
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
