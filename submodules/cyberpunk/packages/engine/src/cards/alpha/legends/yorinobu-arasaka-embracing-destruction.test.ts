import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaFloorIt,
  alphaRuthlessLowlife,
  alphaYorinobuArasakaEmbracingDestruction,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Yorinobu Arasaka - Embracing Destruction", () => {
  it("draws on the first friendly Arasaka attack then discards below 20 Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaRuthlessLowlife],
        deck: [alphaFloorIt],
        field: [{ card: alphaArmoredMinotaur, spent: false, playedThisTurn: false }],
        legendArea: [{ card: alphaYorinobuArasakaEmbracingDestruction, faceDown: false }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.attackUnit(alphaArmoredMinotaur, alphaCorpoSecurity, { as: P1 });
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(2);
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    expect(engine.resolveDiscardFromHand([alphaRuthlessLowlife], { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
  });
});
