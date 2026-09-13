import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05DestinyGundam055 } from "./055-destiny-gundam.ts";

function enemyDamageCommand() {
  return createMockCommand({
    name: "Enemy Damage Command",
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 3,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Action】Choose 1 enemy Unit. Deal 3 damage to it.",
      },
    ],
  });
}

describe("Destiny Gundam (GD05-055)", () => {
  /** @behavioral-proof complete: First Strike timing plus battle-only, enemy-only, once-per-turn reduction are public. */
  it("<First Strike> destroys the defender before it can deal battle damage", () => {
    const defender = createMockUnit({ name: "Lethal Defender", ap: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05DestinyGundam055] },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(destinyId, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getDamage(destinyId)).toBe(0);
  });

  it("reduces the first enemy battle damage by 2 but not a second battle that turn", () => {
    const firstEnemy = createMockUnit({ name: "First Enemy", ap: 3, hp: 10 });
    const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 3, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        play: [{ card: gd05DestinyGundam055, exhausted: true }],
        deck: 5,
      },
      { play: [firstEnemy, secondEnemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(firstEnemyId!, destinyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getDamage(destinyId)).toBe(1);

    expectSuccess(p2.enterBattle(secondEnemyId!, destinyId));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getDamage(destinyId)).toBe(4);
  });

  it("does not reduce enemy effect damage", () => {
    const damageCommand = enemyDamageCommand();
    const engine = GundamTestEngine.create(
      { play: [gd05DestinyGundam055] },
      {
        hand: [damageCommand],
        resourceArea: activeResources(1),
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const destinyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.playCommand(damageCommand));
    expectSuccess(p2.resolveEffect({ targets: [destinyId] }));

    expect(p1.getDamage(destinyId)).toBe(3);
  });
});
