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
import { gd01FortressDefense106 } from "../../gd01/command/106-fortress-defense.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Sodon123 } from "./123-sodon.ts";

describe("Sodon (GD02-123)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Sodon123] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Sodon Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Sodon123)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("lets the chosen Unit token attack an active enemy with 5 or less AP", () => {
    const enemy = createMockUnit({ ap: 5, hp: 6 });
    const tooStrong = createMockUnit({ ap: 6, hp: 6 });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01FortressDefense106, gd02Sodon123],
        shieldArea: [returnedShield],
        resourceArea: activeResources(8),
        deck: 4,
      },
      { play: [enemy, tooStrong], deck: 4 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [enemyId, tooStrongId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(gd01FortressDefense106));
    const tokenIds = p1.getCardsInZone("battleArea");
    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.deployBase(gd02Sodon123));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible friendly Unit-token choice");
    }
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining(tokenIds));
    const tokenId = tokenIds[0]!;
    expectSuccess(p1.resolveEffect({ targets: [tokenId] }));

    expect(p1.getLegalAttackTargets(tokenId)).toContain(enemyId);
    expect(p1.getLegalAttackTargets(tokenId)).not.toContain(tooStrongId);
    expectSuccess(p1.enterBattle(tokenId, enemyId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("does not offer a normal Unit as the Unit-token target", () => {
    const normalUnit = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd02Sodon123],
      play: [normalUnit],
      shieldArea: [createMockUnit({ name: "Shield" })],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const normalId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd02Sodon123));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getLegalAttackTargets(normalId)).toEqual(["direct"]);
  });

  it("cannot be deployed below its printed Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Sodon123],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Sodon123),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Sodon123)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 3,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Sodon123],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, sodonId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(sodonId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(sodonId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
