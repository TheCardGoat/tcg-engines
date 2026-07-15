import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrategicArms108 } from "../command/108-strategic-arms.ts";
import { gd01Side7124 } from "./124-side-7.ts";

describe("Side 7 (GD01-124)", () => {
  it("【Burst】 deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd01Side7124] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01Side7124)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 adds one Shield to hand", () => {
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd01Side7124],
      shieldArea: [returnedShield],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd01Side7124));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd01Side7124)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("【Activate･Main】 rests Side 7 and recovers 1 HP from a legally damaged friendly Unit", () => {
    const friendly = createMockUnit({ hp: 6, keywordEffects: [{ keyword: "Blocker" }] });
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108],
      play: [friendly],
      baseSection: [gd01Side7124],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expect(p1.getDamage(friendlyId)).toBe(2);
    expectSuccess(p1.activateAbility(baseId, 0));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Side 7 to ask which damaged friendly Unit to recover");
    }
    expect(choice.legalTargetIds).toEqual([friendlyId]);
    expectSuccess(p1.resolveEffect({ targets: [friendlyId] }));

    expect(p1.getDamage(friendlyId)).toBe(1);
    expect(p1.isExhausted(baseId)).toBe(true);
    expectFailure(p1.activateAbility(baseId, 0, { targets: [friendlyId] }), "CARD_EXHAUSTED");
  });

  it("rejects an enemy Unit as the recovery target", () => {
    const friendly = createMockUnit({ hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const enemy = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01StrategicArms108],
        play: [friendly],
        baseSection: [gd01Side7124],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expectFailure(p1.activateAbility(baseId, 0, { targets: [enemyId] }), "ILLEGAL_TARGET");
  });

  it("places Side 7, lets its controller choose which Base remains, then resolves Deploy", () => {
    const establishedBase = createMockBase({ name: "Established Base" });
    const returnedShield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [gd01Side7124],
      shieldArea: [returnedShield],
      baseSection: [establishedBase],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const establishedBaseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.deployBase(gd01Side7124));

    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected a Base-section replacement choice");
    }
    const visibleBases = p1.getCardsInZone("baseSection");
    const side7Id = visibleBases.find((cardId) => cardId !== establishedBaseId)!;
    expect(visibleBases).toEqual(expect.arrayContaining([establishedBaseId, side7Id]));
    expect(choice).toMatchObject({
      controllerId: PLAYER_ONE,
      sourceCardId: side7Id,
      minTargets: 1,
      maxTargets: 1,
    });
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([establishedBaseId, side7Id]));
    expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);

    expectSuccess(p1.resolveEffect({ targets: [establishedBaseId] }));

    expect(p1.getCardZone(establishedBaseId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(side7Id)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
  });
});
