import { describe, expect, it } from "vite-plus/test";
import {
  alphaKiroshiOptics,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailPanamPalmerNomadCavalry,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";
import { expectLegendCanBeCalled } from "../../support-test-helpers.ts";

describe("Panam Palmer - Nomad Cavalry", () => {
  it("can be called through the engine", () => {
    expectLegendCanBeCalled(welcomeToNightCityRetailPanamPalmerNomadCavalry);
  });

  it("moves an attached Gear from herself to an unequipped friendly Unit and readies it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaSwordwiseHuscle, spent: true }],
      legendArea: [
        {
          card: welcomeToNightCityRetailPanamPalmerNomadCavalry,
          faceDown: false,
          spent: false,
          attachedGears: [alphaKiroshiOptics],
        },
      ],
      eddies: 2,
    });

    engine.activateAbility(welcomeToNightCityRetailPanamPalmerNomadCavalry, 0, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    expect(choice?.payload).toMatchObject({ type: "effectTarget" });
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Panam to ask for the Gear to move.");
    }
    expect(choice.payload.eligibleIds).toHaveLength(1);
    engine.resolveEffectTarget(alphaKiroshiOptics, { as: P1 });

    const unit = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    const panam = engine.getCard(welcomeToNightCityRetailPanamPalmerNomadCavalry, "legendArea", P1);
    expect(unit.meta.spent).toBe(false);
    expect(unit.meta.attachedGearIds).toHaveLength(1);
    expect(panam.meta.attachedGearIds).toHaveLength(0);
    expect(engine.getEddies(P1)).toBe(0);
  });
});
