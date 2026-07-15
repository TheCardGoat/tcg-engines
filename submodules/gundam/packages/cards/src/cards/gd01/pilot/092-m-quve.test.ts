import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01MQuve092 } from "./092-m-quve.ts";

describe("M'Quve (GD01-092)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd01MQuve092] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01MQuve092)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("grants Breach 1 while paired with a Zeon Unit", () => {
    const zeonUnit = createMockUnit({ ap: 2, hp: 4, traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gd01MQuve092],
      play: [zeonUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01MQuve092, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Breach");
    expect(p1.getVisibleCard(unitId)?.keywordEffects).toContainEqual({
      keyword: "Breach",
      value: 1,
    });
  });

  it("does not grant Breach while paired with a non-Zeon Unit", () => {
    const federationUnit = createMockUnit({ ap: 2, hp: 4, traits: ["earth federation"] });
    const engine = GundamTestEngine.create({
      hand: [gd01MQuve092],
      play: [federationUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01MQuve092, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Breach");
    expect(p1.getVisibleCard(unitId)?.keywordEffects).not.toContainEqual({
      keyword: "Breach",
      value: 1,
    });
  });
});
