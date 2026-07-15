import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPeaceOffering,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Peace Offering", () => {
  it("sets one Gig to another Gig's value and draws from a value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(welcomeToNightCityRetailPeaceOffering, { as: P1 });
    const selectedGigIds = engine.getGigDice(P1).map((die) => die.id);
    engine.resolveEffectTargetIds(selectedGigIds, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailPeaceOffering.id),
    ).toBe(true);
  });

  it("uses the first selected Gig as the source and the second as the target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 4 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailPeaceOffering, { as: P1 });
    const d4 = engine.getGigDice(P1).find((die) => die.dieType === "d4");
    const d6 = engine.getGigDice(P1).find((die) => die.dieType === "d6");
    expect(d4).toBeDefined();
    expect(d6).toBeDefined();

    engine.resolveEffectTargetIds([d4!.id, d6!.id], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === d6!.id)?.faceValue).toBe(4);
  });

  it("caps copied values at the target die maximum", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        eddies: 1,
        gigArea: [
          { dieType: "d6", faceValue: 5 },
          { dieType: "d4", faceValue: 4 },
        ],
      },
      {},
    );

    engine.playCard(welcomeToNightCityRetailPeaceOffering, { as: P1 });
    const d6 = engine.getGigDice(P1).find((die) => die.dieType === "d6");
    const d4 = engine.getGigDice(P1).find((die) => die.dieType === "d4");
    expect(d6).toBeDefined();
    expect(d4).toBeDefined();

    engine.resolveEffectTargetIds([d6!.id, d4!.id], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === d4!.id)?.faceValue).toBe(4);
  });
});
