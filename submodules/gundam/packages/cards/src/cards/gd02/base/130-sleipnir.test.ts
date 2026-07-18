import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Sleipnir130 } from "./130-sleipnir.ts";

describe("Sleipnir (GD02-130)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Sleipnir130] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Sleipnir Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Sleipnir130)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a Shield and gives the chosen enemy AP-2 with a Gjallarhorn Unit in play", () => {
    const gjallarhorn = createMockUnit({ traits: ["gjallarhorn"] });
    const firstEnemy = createMockUnit({ ap: 4, hp: 6 });
    const secondEnemy = createMockUnit({ ap: 5, hp: 6 });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Sleipnir130],
        play: [gjallarhorn],
        shieldArea: [returnedShield],
        resourceArea: activeResources(4),
      },
      { play: [firstEnemy, secondEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd02Sleipnir130));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible enemy Unit AP-reduction choice");
    }
    expect(choice.legalTargetIds).toEqual([firstEnemyId, secondEnemyId]);
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));

    expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(2);
    expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(5);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("does not reduce AP without a friendly Gjallarhorn Unit", () => {
    const enemy = createMockUnit({ ap: 4, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02Sleipnir130],
        play: [createMockUnit({ traits: ["teiwaz"] })],
        shieldArea: [createMockUnit({ name: "Shield" })],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd02Sleipnir130));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
  });

  it("cannot be deployed below its printed Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Sleipnir130],
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Sleipnir130),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Sleipnir130)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Sleipnir130],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, sleipnirId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(sleipnirId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(sleipnirId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
