import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01SaylaMass087 } from "./087-sayla-mass.ts";

describe("Sayla Mass (GD01-087)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01SaylaMass087] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({ kind: "optional", directiveIndex: -1 });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd01SaylaMass087)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("grants Repair 1 while paired with a blue Unit", () => {
    const blueUnit = createMockUnit({ color: "blue", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01SaylaMass087],
      play: [blueUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01SaylaMass087, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).toContain("Repair");
    expect(p1.getVisibleCard(unitId)?.keywordEffects).toContainEqual({
      keyword: "Repair",
      value: 1,
    });
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("does not grant Repair while paired with a non-blue Unit", () => {
    const greenUnit = createMockUnit({ color: "green", ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01SaylaMass087],
      play: [greenUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01SaylaMass087, unitId));

    expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Repair");
    expect(p1.getVisibleCard(unitId)?.keywordEffects).not.toContainEqual({
      keyword: "Repair",
      value: 1,
    });
  });
});
