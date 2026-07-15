import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Eternal131 } from "./131-eternal.ts";

describe("Eternal (GD03-131)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Eternal131] });
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

    expect(p2.getCardZone(gd03Eternal131)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a shield to hand and returns only an eligible enemy with two TSA Units", () => {
    const tsaA = createMockUnit({ cardNumber: "TEST-TSA-A", traits: ["triple ship alliance"] });
    const tsaB = createMockUnit({ cardNumber: "TEST-TSA-B", traits: ["triple ship alliance"] });
    const lowEnemy = createMockUnit({ cardNumber: "TEST-LOW-ENEMY", level: 4 });
    const highEnemy = createMockUnit({ cardNumber: "TEST-HIGH-ENEMY", level: 5 });
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Eternal131],
        play: [tsaA, tsaB],
        resourceArea: activeResources(5),
        shieldArea: [returnedShield],
      },
      { play: [lowEnemy, highEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd03Eternal131));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowEnemyId!] }));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Eternal131)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p2.getCardsInZone("hand")).toContain(lowEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(highEnemyId);
  });

  it("does not offer a return target with fewer than two Triple Ship Alliance Units", () => {
    const tsa = createMockUnit({ traits: ["triple ship alliance"] });
    const enemy = createMockUnit({ level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Eternal131],
        play: [tsa],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd03Eternal131));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });

  it("does not offer a return choice when every enemy is Lv.5 or higher", () => {
    const tsaA = createMockUnit({ cardNumber: "TEST-TSA-A", traits: ["triple ship alliance"] });
    const tsaB = createMockUnit({ cardNumber: "TEST-TSA-B", traits: ["triple ship alliance"] });
    const enemy = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03Eternal131],
        play: [tsaA, tsaB],
        resourceArea: activeResources(5),
        shieldArea: [createMockUnit({ name: "Shield" })],
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd03Eternal131));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(gd03Eternal131)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
  });
});
