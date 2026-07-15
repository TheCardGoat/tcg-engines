import { describe, it, expect } from "vite-plus/test";
import type { UnitCard } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04LoranCehack097 } from "../pilot/097-loran-cehack.ts";
import { gd04Gundam069 } from "./069-gundam.ts";

describe("∀ Gundam (GD04-069)", () => {
  describe("<Blocker>", () => {
    it("redirects an attack from another friendly Unit to ∀ Gundam", () => {
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: defender, exhausted: true }, gd04Gundam069] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, blockerId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, defenderId!));
      expectSuccess(p2.declareBlock(blockerId!));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(blockerId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(defenderId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getDamage(defenderId!)).toBe(0);
      expect(p1.getDamage(attackerId)).toBe(4);
    });
  });

  it("prompts at end of turn to set one rested Militia Unit active after a qualifying payment", () => {
    const chosenMilitia = createMockUnit({ name: "Chosen Militia", traits: ["militia"] });
    const otherMilitia = createMockUnit({ name: "Other Militia", traits: ["militia"] });
    const payer: UnitCard = createMockUnit({
      traits: ["militia"],
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { payResources: 1 },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【Activate･Main】①：Draw 1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [gd04LoranCehack097],
      play: [
        gd04Gundam069,
        { card: chosenMilitia, exhausted: true },
        { card: otherMilitia, exhausted: true },
        payer,
      ],
      resourceArea: activeResources(6),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [turnAId, chosenMilitiaId, otherMilitiaId, payerId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd04LoranCehack097, turnAId!));
    expectSuccess(p1.activateAbility(payerId!, 0));

    expect(p1.isExhausted(chosenMilitiaId!)).toBe(true);
    expect(p1.isExhausted(otherMilitiaId!)).toBe(true);

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: turnAId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: expect.arrayContaining([chosenMilitiaId, otherMilitiaId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [chosenMilitiaId!] }));

    expect(p1.isExhausted(chosenMilitiaId!)).toBe(false);
    expect(p1.isExhausted(otherMilitiaId!)).toBe(true);
  });
});
