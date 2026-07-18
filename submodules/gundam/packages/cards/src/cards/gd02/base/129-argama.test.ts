import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Argama129 } from "./129-argama.ts";

function damageBaseCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: owner === "friendly" ? "Friendly Base Damage" : "Enemy Base Damage",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner, cardType: "base", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose a Base. Deal 2 damage to it.",
      },
    ],
  });
}

describe("Argama (GD02-129)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Argama129] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Argama Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Argama129)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand and pays its printed cost", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd02Argama129],
      shieldArea: [returnedShield],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd02Argama129));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd02Argama129)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("prevents effect damage from an enemy Command", () => {
    const enemyDamage = damageBaseCommand("opponent");
    const engine = GundamTestEngine.create(
      { baseSection: [gd02Argama129], deck: 3 },
      { hand: [enemyDamage], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p2.playCommand(enemyDamage));
    const choice = p2.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected the enemy Base choice");
    expect(choice.legalTargetIds).toEqual([baseId]);
    expectSuccess(p2.resolveEffect({ targets: [baseId] }));

    expect(p1.getDamage(baseId)).toBe(0);
    expect(p2.getCardZone(enemyDamage)).toBe(`trash:${PLAYER_TWO}`);
  });

  it("does not prevent effect damage from its controller's own Command", () => {
    const friendlyDamage = damageBaseCommand("friendly");
    const engine = GundamTestEngine.create({
      hand: [friendlyDamage],
      baseSection: [gd02Argama129],
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.playCommand(friendlyDamage));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected the friendly Base choice");
    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p1.getDamage(baseId)).toBe(2);
  });

  it("cannot be deployed below its printed Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Argama129],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Argama129),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Argama129)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 3,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Argama129],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, argamaId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(argamaId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(argamaId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
