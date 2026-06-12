import { describe, expect, it } from "vite-plus/test";
import {
  alphaGoroTakemuraHandsUnclean,
  alphaKiroshiOptics,
  alphaSwordwiseHuscle,
  alphaVCorporateExile,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Kiroshi Optics", () => {
  it("looks at a friendly face-down legend without revealing it", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: alphaSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [alphaKiroshiOptics],
        },
      ],
      legendArea: [
        { card: alphaVCorporateExile, faceDown: true },
        { card: alphaGoroTakemuraHandsUnclean, faceDown: false },
      ],
    });
    const faceDownLegendId = engine.findCardId(alphaVCorporateExile, "legendArea", P1);

    engine.attackRival(alphaSwordwiseHuscle, { as: P1 });
    expect(engine.resolveEffectTarget(alphaVCorporateExile, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCard(faceDownLegendId, "legendArea", P1).meta.faceDown).toBe(true);
    expect(engine.getPrompt(P1).choice).toBeNull();
  });
});
