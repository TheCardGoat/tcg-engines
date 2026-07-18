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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd02Diva124 } from "./124-diva.ts";

describe("Diva (GD02-124)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd02Diva124] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burstPrompt = p2.getBoardView().pendingChoice;
    if (burstPrompt?.kind !== "optional") {
      throw new Error("Expected a visible Diva Burst choice");
    }
    expect(burstPrompt).toMatchObject({
      controllerId: PLAYER_TWO,
      prompt: "【Burst】Deploy this card.",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burstPrompt.directiveIndex]: true } }));

    expect(p2.getCardZone(gd02Diva124)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds a Shield and gives only friendly green Earth Federation Units AP+1 at Lv.7", () => {
    const eligible = createMockUnit({
      name: "Eligible",
      ap: 2,
      color: "green",
      traits: ["earth federation"],
    });
    const wrongColor = createMockUnit({
      name: "Wrong Color",
      ap: 3,
      color: "blue",
      traits: ["earth federation"],
    });
    const wrongTrait = createMockUnit({
      name: "Wrong Trait",
      ap: 4,
      color: "green",
      traits: ["zeon"],
    });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd02Diva124],
      play: [eligible, wrongColor, wrongTrait],
      shieldArea: [returnedShield],
      resourceArea: activeResources(7),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [eligibleId, wrongColorId, wrongTraitId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.deployBase(gd02Diva124));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(eligibleId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(wrongColorId!)?.effectiveAp).toBe(3);
    expect(p1.getVisibleCard(wrongTraitId!)?.effectiveAp).toBe(4);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);

    passTurnThroughPublicMoves(engine, PLAYER_ONE);
    expect(p1.getVisibleCard(eligibleId!)?.effectiveAp).toBe(2);
  });

  it("does not grant AP below Lv.7", () => {
    const eligible = createMockUnit({
      ap: 2,
      color: "green",
      traits: ["earth federation"],
    });
    const engine = GundamTestEngine.create({
      hand: [gd02Diva124],
      play: [eligible],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const eligibleId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployBase(gd02Diva124));

    expect(p1.getVisibleCard(eligibleId)?.effectiveAp).toBe(2);
  });

  it("cannot be deployed below its printed Lv.3", () => {
    const engine = GundamTestEngine.create({
      hand: [gd02Diva124],
      resourceArea: activeResources(2),
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployBase(gd02Diva124),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
    expect(engine.asPlayer(PLAYER_ONE).getCardZone(gd02Diva124)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("cannot pay its printed cost after a legal deployment exhausts all Resources", () => {
    const resourceSpender = createMockUnit({
      name: "Resource Spender",
      level: 0,
      cost: 3,
    });
    const engine = GundamTestEngine.create({
      hand: [resourceSpender, gd02Diva124],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [resourceSpenderId, divaId] = p1.getHand();

    expectSuccess(p1.deployUnit(resourceSpenderId!));
    expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(0);
    expectFailure(p1.deployBase(divaId!), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(divaId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
