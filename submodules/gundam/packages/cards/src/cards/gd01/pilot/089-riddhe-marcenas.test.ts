import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01RiddheMarcenas089 } from "./089-riddhe-marcenas.ts";

describe("Riddhe Marcenas (GD01-089)", () => {
  it("【Burst】 adds the revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd01RiddheMarcenas089] },
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

    expect(p2.getCardZone(gd01RiddheMarcenas089)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("gives the paired Unit AP+1 while it has Repair", () => {
    const repairUnit = createMockUnit({
      ap: 2,
      hp: 4,
      keywordEffects: [{ keyword: "Repair", value: 1 }],
    });
    const engine = GundamTestEngine.create({
      hand: [gd01RiddheMarcenas089],
      play: [repairUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01RiddheMarcenas089, unitId));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, keywords: ["Repair"] });
  });

  it("does not give the conditional AP when the paired Unit lacks Repair", () => {
    const plainUnit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd01RiddheMarcenas089],
      play: [plainUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd01RiddheMarcenas089, unitId));

    expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(3);
  });
});
