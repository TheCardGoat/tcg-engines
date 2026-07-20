import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaM1Astray081 } from "./081-m1-astray.ts";
import { restUnitsByAttackingDirectly } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("M1 Astray (GD01-081, beta reprint)", () => {
  it("gets AP+1 and Blocker with another Triple Ship Alliance Unit, then blocks visibly", () => {
    const ally = createMockUnit({ traits: ["triple ship alliance"], hp: 5 });
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [betaM1Astray081], play: [ally], resourceArea: activeResources(2), deck: 5 },
      { play: [attacker], deck: 5, shieldArea: [createMockUnit({ name: "Opening Shield" })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_ONE, [allyId]);
    expectSuccess(p1.deployUnit(betaM1Astray081));
    const astrayId = p1.getCardsInZone("battleArea").at(-1)!;
    expect(p1.getVisibleCard(astrayId)).toMatchObject({ effectiveAp: 3, effectiveHp: 2 });
    expect(p1.getVisibleCard(astrayId)?.keywords).toContain("Blocker");
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, allyId));
    expectSuccess(p1.declareBlock(astrayId));
    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(astrayId);
  });

  it("keeps printed AP and has no Blocker without another Triple Ship Alliance Unit", () => {
    const unrelated = createMockUnit({ traits: ["academy"] });
    const engine = GundamTestEngine.create({
      hand: [betaM1Astray081],
      play: [unrelated],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(betaM1Astray081));
    const astrayId = p1.getCardsInZone("battleArea").at(-1)!;
    expect(p1.getVisibleCard(astrayId)?.effectiveAp).toBe(2);
    expect(p1.getVisibleCard(astrayId)?.keywords).not.toContain("Blocker");
  });
});
