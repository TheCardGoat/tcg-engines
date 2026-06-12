import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerEvelynParkerBeautifulEnigma,
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Evelyn Parker - Beautiful Enigma", () => {
  it("calls to decrease a rival Gig by three", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: spoilerEvelynParkerBeautifulEnigma, faceDown: true }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );

    engine.callLegend(spoilerEvelynParkerBeautifulEnigma, { as: P1 });

    expect(engine.getGigValue(P2)).toBe(3);
  });

  it("spends to search the top three for a Braindance Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaCorporateSurveillance],
      legendArea: [{ card: spoilerEvelynParkerBeautifulEnigma, faceDown: false }],
    });

    engine.activateAbility(spoilerEvelynParkerBeautifulEnigma, 1, { as: P1 });

    expect(engine.getPrompt(P1).choice?.type).toBe("searchDeck");
  });

  it("spends and prompts even when the search has no matching Braindance Program", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaFloorIt],
      legendArea: [{ card: spoilerEvelynParkerBeautifulEnigma, faceDown: false }],
    });

    engine.activateAbility(spoilerEvelynParkerBeautifulEnigma, 1, { as: P1 });

    expect(engine.getCard(spoilerEvelynParkerBeautifulEnigma).meta.spent).toBe(true);
    expect(engine.getPrompt(P1).choice?.type).toBe("searchDeck");
  });

  it("retail activated ability makes the selected rival unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
        ],
        eddies: 1,
      },
      {
        field: [
          { card: alphaSwordwiseHuscle, playedThisTurn: false },
          { card: alphaRuthlessLowlife, playedThisTurn: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.activateAbility(welcomeToNightCityRetailEvelynParkerBeautifulEnigma, 1, { as: P1 });
    engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 });
    engine.passPhase({ as: P1 });

    expect(engine.executeMove("passPhase", { args: {} }, P2)).toMatchObject({
      success: false,
      errorCode: "MUST_ATTACK",
    });
    const otherAttackerId = engine.findCardId(alphaRuthlessLowlife, "field", P2);
    expect(
      engine.executeMove("attackRival", { args: { attackerId: otherAttackerId as string } }, P2),
    ).toMatchObject({
      success: false,
      errorCode: "MUST_ATTACK",
    });
    expect(engine.attackRival(alphaSwordwiseHuscle, { as: P2 })).toMatchObject({ success: true });
  });
});
