import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Zanzibar125 } from "./125-zanzibar.ts";

describe("Zanzibar (GD01-125)", () => {
  it("【Burst】 deploys the Base but does not offer the Unit deployment during the opponent's turn", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const zeonUnit = createMockUnit({ level: 4, traits: ["zeon"] });
    const engine = GundamTestEngine.create(
      { hand: [zeonUnit], shieldArea: [gd01Zanzibar125] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getCardZone(gd01Zanzibar125)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(zeonUnit)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("【Deploy】 adds a Shield, then offers only a Zeon Unit at Lv.4 or lower during its controller's turn", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const eligible = createMockUnit({ name: "Eligible Zeon", level: 4, traits: ["zeon"] });
    const highLevel = createMockUnit({ name: "High Zeon", level: 5, traits: ["zeon"] });
    const wrongTrait = createMockUnit({ name: "Wrong Trait", level: 4, traits: ["zaft"] });
    const engine = GundamTestEngine.create({
      hand: [gd01Zanzibar125, eligible, highLevel, wrongTrait],
      shieldArea: [returnedShield],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [, eligibleId, highLevelId, wrongTraitId] = p1.getHand();

    expectSuccess(p1.deployBase(gd01Zanzibar125));
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected Zanzibar's optional deployment");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.getCardZone(eligibleId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(highLevelId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(wrongTraitId!)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("can deploy the eligible Zeon Unit that was just added from Shields", () => {
    const eligibleShield = createMockUnit({
      name: "Shield Zeon",
      level: 4,
      traits: ["zeon"],
    });
    const engine = GundamTestEngine.create({
      hand: [gd01Zanzibar125],
      shieldArea: [eligibleShield],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01Zanzibar125));
    expect(p1.getCardZone(eligibleShield)).toBe(`hand:${PLAYER_ONE}`);
    const eligibleShieldId = p1.getHand()[0]!;
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected Zanzibar's optional deployment");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleShieldId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleShieldId] }));

    expect(p1.getCardZone(eligibleShieldId)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("lets the player decline the optional Unit deployment", () => {
    const zeonUnit = createMockUnit({ level: 4, traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd01Zanzibar125, zeonUnit],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01Zanzibar125));
    const optional = p1.getBoardView().pendingChoice;
    if (optional?.kind !== "optional") throw new Error("Expected Zanzibar's optional deployment");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } }));

    expect(p1.getCardZone(zeonUnit)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});
