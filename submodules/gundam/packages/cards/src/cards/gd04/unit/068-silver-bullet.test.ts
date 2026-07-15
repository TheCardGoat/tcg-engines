import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04SilverBullet068 } from "./068-silver-bullet.ts";

describe("Silver Bullet (GD04-068)", () => {
  function damageCommand(owner: "friendly" | "opponent") {
    return createMockCommand({
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 5,
                target: { owner, cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Deal 5 effect damage to 1 Unit.",
        },
      ],
    });
  }

  it("reduces enemy effect damage to itself by 3", () => {
    const command = damageCommand("opponent");
    const engine = GundamTestEngine.create(
      { play: [gd04SilverBullet068] },
      { hand: [command], resourceArea: activeResources(1) },
      { initialActivePlayer: PLAYER_TWO },
    );
    const silverBulletId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    expectSuccess(engine.asPlayer(PLAYER_TWO).playCommand(command, { targets: [silverBulletId] }));

    expect(engine.asPlayer(PLAYER_ONE).getDamage(silverBulletId)).toBe(2);
  });

  it("does not reduce effect damage from its controller", () => {
    const command = damageCommand("friendly");
    const engine = GundamTestEngine.create({
      hand: [command],
      play: [gd04SilverBullet068],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const silverBulletId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(command, { targets: [silverBulletId] }));

    expect(p1.getCardZone(silverBulletId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("uses Blocker to redirect an attack to itself", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [{ card: defender, exhausted: true }, gd04SilverBullet068] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.declareBlock(blockerId!));
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(blockerId!)).toBe(`battleArea:${PLAYER_TWO}`);
    expect(p2.getDamage(blockerId!)).toBe(3);
    expect(p2.getDamage(defenderId!)).toBe(0);
    expect(p1.getDamage(attackerId)).toBe(4);
  });
});
