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
import { gd02ShujiSHideout126 } from "./126-shuji-s-hideout.ts";

describe("Shuji's Hideout (GD02-126)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ level: 5, ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd02ShujiSHideout126] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Shuji's Hideout Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02ShujiSHideout126)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd02ShujiSHideout126],
      shieldArea: [returnedShield],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd02ShujiSHideout126));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd02ShujiSHideout126)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("【Destroyed】 damages the chosen enemy Unit at Lv.4 or lower", () => {
    const attacker = createMockUnit({ level: 4, ap: 5, hp: 7 });
    const tooHigh = createMockUnit({ level: 5, hp: 7 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd02ShujiSHideout126], deck: 3 },
      { play: [attacker, tooHigh], deck: 3 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p2.enterBattle(attackerId!, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a visible Lv.4-or-lower enemy Unit choice");
    }
    expect(choice.legalTargetIds).toEqual([attackerId]);
    expect(choice.legalTargetIds).not.toContain(tooHighId);
    expectSuccess(p1.resolveEffect({ targets: [attackerId!] }));

    expect(p1.getCardZone(gd02ShujiSHideout126)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getDamage(attackerId!)).toBe(1);
    expect(p2.getDamage(tooHighId!)).toBe(0);
  });

  it("cannot be deployed below its printed Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02ShujiSHideout126],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02ShujiSHideout126),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02ShujiSHideout126)).toBe(
      `hand:${PLAYER_ONE}`,
    );
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 3,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02ShujiSHideout126],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, hideoutId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(hideoutId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(hideoutId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
