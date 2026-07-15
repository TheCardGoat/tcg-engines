import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Jupitris123 } from "./123-jupitris.ts";

describe("Jupitris (GD03-123)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Jupitris123] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Jupitris123)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a shield to hand and rests only an eligible enemy with a friendly Jupitris Unit", () => {
    const ally = createMockUnit({ traits: ["jupitris"] });
    const lowEnemy = createMockUnit({ level: 3 });
    const highEnemy = createMockUnit({ level: 4 });
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Jupitris123],
        play: [ally],
        resourceArea: activeResources(3),
        shieldArea: [returnedShield],
      },
      { play: [lowEnemy, highEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03Jupitris123));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowEnemyId!] }));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Jupitris123)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p2.isExhausted(lowEnemyId!)).toBe(true);
    expect(p2.isExhausted(highEnemyId!)).toBe(false);
  });

  it("does not offer a rest target without a friendly Jupitris Unit", () => {
    const ally = createMockUnit({ traits: ["titans"] });
    const enemy = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Jupitris123],
        play: [ally],
        resourceArea: activeResources(3),
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd03Jupitris123));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.isExhausted(enemyId)).toBe(false);
  });
});
