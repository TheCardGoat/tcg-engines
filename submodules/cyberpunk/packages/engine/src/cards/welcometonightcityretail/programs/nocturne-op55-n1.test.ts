import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailNocturneOp55N1,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
} from "@tcg/cyberpunk-cards";
import { computeEffectiveCost } from "../../../moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1, P2, expectNotAttackCandidate } from "../../../testing/index.ts";

const nocturne = welcomeToNightCityRetailNocturneOp55N1;

describe("Nocturne OP55 N1", () => {
  it("replaces its play cost with 1 €$ when the fixer area is empty", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        eddies: 1,
        fixerDice: [],
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailFieldOperator],
      },
      { fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"] },
    );
    const id = engine.findCardId(nocturne, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(1);

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getHandCount(P1)).toBe(2);
  });

  it("keeps its printed 3 €$ cost while the fixer still has dice", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [nocturne],
      legendArea: [],
      eddies: 1,
      fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"],
    });
    const id = engine.findCardId(nocturne, "hand", P1);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    const failure = engine.expectFailure(() => engine.playCard(nocturne, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
  });

  it("can stop a Unit from attacking until the caster's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        eddies: 1,
        fixerDice: [],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"],
      },
    );

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("cant-attack", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expectNotAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P2 });
  });

  it("lets a friendly Legend use Go Solo for 2 less this turn, minimum 1", () => {
    const legend = welcomeToNightCityRetailRogueAmendiaresPreemSolo;
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nocturne],
        legendArea: [{ card: legend, faceDown: false }],
        eddies: 6,
        fixerDice: [],
      },
      { fixerDice: ["d4", "d6", "d8", "d10", "d12", "d20"] },
    );

    engine.playCard(nocturne, { as: P1 });
    engine.resolveChooseEffect("go-solo", { as: P1 });

    const legendId = engine.findCardId(legend, "legendArea", P1);
    expect(computeEffectiveCost(engine.getState(), legendId, P1)).toBe(5);
    expect(engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1).success).toBe(
      true,
    );
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      legend.id,
    );
  });
});
