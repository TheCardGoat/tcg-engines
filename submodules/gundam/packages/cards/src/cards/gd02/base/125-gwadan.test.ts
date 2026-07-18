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
import { gd02Gwadan125 } from "./125-gwadan.ts";

describe("Gwadan (GD02-125)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Gwadan125] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Gwadan Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Gwadan125)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a Shield, lets the player discard a red card, and then draws one", () => {
    const redCard = createMockUnit({ name: "Red Card", color: "red" });
    const blueCard = createMockUnit({ name: "Blue Card", color: "blue" });
    const returnedShield = createMockUnit({ name: "Returned Shield", color: "green" });
    const engine = GundamTestEngine.create({
      hand: [gd02Gwadan125, redCard, blueCard],
      shieldArea: [returnedShield],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, redCardId, blueCardId] = p1.getHand();

    expectSuccess(p1.deployBase(gd02Gwadan125));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected the optional red discard");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    const discardChoice = p1.getBoardView().pendingChoice;
    if (discardChoice?.kind !== "targetSelection") {
      throw new Error("Expected a visible red-card discard choice");
    }
    expect(discardChoice.legalTargetIds).toEqual([redCardId]);
    expect(discardChoice.legalTargetIds).not.toContain(blueCardId);
    expectSuccess(p1.resolveEffect({ targets: [redCardId!] }));

    expect(p1.getCardZone(redCardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(blueCardId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("lets the player decline the red discard without drawing", () => {
    const redCard = createMockUnit({ color: "red" });
    const engine = GundamTestEngine.create({
      hand: [gd02Gwadan125, redCard],
      shieldArea: [createMockUnit({ name: "Shield" })],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const redCardId = p1.getHand()[1]!;

    expectSuccess(p1.deployBase(gd02Gwadan125));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected the optional red discard");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardZone(redCardId)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
  });

  it("cannot be deployed below its printed Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Gwadan125],
      resourceArea: activeResources(3),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Gwadan125),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Gwadan125)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 4,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Gwadan125],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, gwadanId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(gwadanId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gwadanId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
