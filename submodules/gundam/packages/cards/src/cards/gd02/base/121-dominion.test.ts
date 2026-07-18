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
import { gd01StrategicArms108 } from "../../gd01/command/108-strategic-arms.ts";
import { gd02Dominion121 } from "./121-dominion.ts";

describe("Dominion (GD02-121)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ level: 5, ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Dominion121] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Dominion Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Dominion121)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds a Shield and recovers 2 HP from the chosen friendly blue Unit", () => {
    const blueUnit = createMockUnit({
      color: "blue",
      hp: 7,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const greenUnit = createMockUnit({
      color: "green",
      hp: 7,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108, gd02Dominion121],
      play: [blueUnit, greenUnit],
      shieldArea: [returnedShield],
      resourceArea: activeResources(8),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [blueUnitId, greenUnitId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getHand()[1]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expect(p1.getDamage(blueUnitId!)).toBe(2);
    expect(p1.getDamage(greenUnitId!)).toBe(2);
    expectSuccess(p1.deployBase(baseId));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly blue Unit recovery choice");
    }
    expect(choice.legalTargetIds).toEqual([blueUnitId]);
    expect(choice.legalTargetIds).not.toContain(greenUnitId);
    expectSuccess(p1.resolveEffect({ targets: [blueUnitId!] }));

    expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getDamage(blueUnitId!)).toBe(0);
    expect(p1.getDamage(greenUnitId!)).toBe(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(7);
  });

  it("cannot be deployed below its printed Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Dominion121],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployBase(gd02Dominion121), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(gd02Dominion121)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("fires its plain Deploy effect only when Dominion itself is deployed", () => {
    const unrelatedUnit = createMockUnit({ name: "Unrelated Deployment", level: 0, cost: 0 });
    const engine = GundamTestEngine.create({
      hand: [gd02Dominion121, unrelatedUnit],
      shieldArea: [
        createMockUnit({ name: "First Shield" }),
        createMockUnit({ name: "Second Shield" }),
      ],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [dominionId, unrelatedUnitId] = p1.getHand();

    expectSuccess(p1.deployBase(dominionId!));
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);

    expectSuccess(p1.deployUnit(unrelatedUnitId!));
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(unrelatedUnitId!)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Dominion121],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, dominionId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(dominionId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(dominionId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
