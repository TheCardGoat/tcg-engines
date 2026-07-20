import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01StrategicArms108 } from "../../gd01/command/108-strategic-arms.ts";
import { betaSide7124 } from "./124-side-7.ts";
describe("Side 7 (GD01-124)", () => {
  it("【Burst】deploys the revealed Shield into its owner's Base section", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [betaSide7124] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(betaSide7124)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("【Deploy】 moves 1 Shield into the controller's hand", () => {
    const shield = createMockUnit({ name: "Returned Shield" });
    const engine = GundamTestEngine.create({
      hand: [betaSide7124],
      shieldArea: [shield],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(betaSide7124));

    expect(p1.getCardZone(betaSide7124)).toBe(`baseSection:${PLAYER_ONE}`);
    expect(p1.getCardZone(shield)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("【Activate·Main】Rest this Base：chosen friendly Unit recovers 1 HP", () => {
    const target = createMockUnit({ ap: 2, hp: 5, keywordEffects: [{ keyword: "Blocker" }] });
    const bystander = createMockUnit({ ap: 2, hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [gd01StrategicArms108],
      baseSection: [betaSide7124],
      play: [target, bystander],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [targetId, bystanderId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.playCommand(gd01StrategicArms108));
    expect(p1.getDamage(targetId!)).toBe(2);
    expect(p1.getDamage(bystanderId!)).toBe(0);
    expectSuccess(p1.activateAbility(baseId, 0));
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected a friendly Unit choice");
    expect(choice.legalTargetIds).toEqual(expect.arrayContaining([targetId, bystanderId]));
    expectSuccess(p1.resolveEffect({ targets: [targetId!] }));

    expect(p1.getDamage(targetId!)).toBe(1);
    expect(p1.getDamage(bystanderId!)).toBe(0);
    expect(p1.isExhausted(baseId)).toBe(true);
  });
});
