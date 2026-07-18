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
import { gd02Freeden127 } from "./127-freeden.ts";

describe("Freeden (GD02-127)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Freeden127] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Freeden Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Freeden127)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd02Freeden127],
      shieldArea: [returnedShield],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd02Freeden127));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd02Freeden127)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("【Destroyed】 mills the top two cards of its owner's deck into public trash", () => {
    const attacker = createMockUnit({ ap: 5, hp: 7 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd02Freeden127], deck: 5 },
      { play: [attacker], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getCardZone(gd02Freeden127)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    expect(p1.getCardsInZone("trash")).toHaveLength(3);
  });

  it("cannot be deployed below its printed Lv.2", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Freeden127],
      resourceArea: activeResources(1),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Freeden127),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Freeden127)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 2,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Freeden127],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, freedenId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(freedenId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(freedenId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
