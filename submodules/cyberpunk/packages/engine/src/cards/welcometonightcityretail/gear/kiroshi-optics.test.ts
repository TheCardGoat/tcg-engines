import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKiroshiOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Kiroshi Optics (retail)", () => {
  it("looks at a friendly face-down legend without revealing it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      legendArea: [
        { card: theHeistRetailStarterDeckVCorporateExile, faceDown: true },
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
    });
    const faceDownLegendId = engine.findCardId(
      theHeistRetailStarterDeckVCorporateExile,
      "legendArea",
      P1,
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(
      engine.resolveEffectTarget(theHeistRetailStarterDeckVCorporateExile, { as: P1 }),
    ).toMatchObject({
      success: true,
    });

    // Look-at must not flip the legend.
    expect(engine.getCard(faceDownLegendId, "legendArea", P1).meta.faceDown).toBe(true);
    expect(engine.getPrompt(P1).choice).toBeNull();
  });

  it("does not open a target choice when no friendly face-down Legend exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailFieldOperator,
          spent: false,
          hasLag: false,
          attachedGears: [welcomeToNightCityRetailKiroshiOptics],
        },
      ],
      legendArea: [{ card: theHeistRetailStarterDeckVCorporateExile, faceDown: false }],
    });

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
  });
});
