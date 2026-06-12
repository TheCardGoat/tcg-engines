import { describe, expect, it } from "vite-plus/test";
import {
  alphaDyingNightVSPistol,
  alphaJackieWellesPourOneOutForMe,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Jackie Welles - Pour One Out For Me", () => {
  it("increases a friendly Gig after the first blue gear each turn and draws at max value", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaDyingNightVSPistol],
      deck: [alphaRuthlessLowlife],
      field: [{ card: alphaSwordwiseHuscle, spent: false }],
      legendArea: [{ card: alphaJackieWellesPourOneOutForMe, faceDown: false }],
      eddies: 2,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });
    const d4 = engine.getGigDice(P1)[0]!;
    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attachGear(alphaDyingNightVSPistol, alphaSwordwiseHuscle, { as: P1 });

    expect(engine.getState().G.gigDice[d4.id]!.faceValue).toBe(4);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
  });
});
