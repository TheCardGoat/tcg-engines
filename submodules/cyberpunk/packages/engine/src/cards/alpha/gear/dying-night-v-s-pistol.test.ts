import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaDyingNightVSPistol,
  alphaKiroshiOptics,
  alphaTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Dying Night - V's Pistol", () => {
  it("defeats a rival low-cost gear on attack at 7+ Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaTBugAmateurPhilosopher,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaDyingNightVSPistol],
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      {
        field: [
          {
            card: alphaCorpoSecurity,
            spent: true,
            attachedGears: [alphaKiroshiOptics],
          },
        ],
      },
    );

    engine.attackRival(alphaTBugAmateurPhilosopher, { as: P1 });
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    expect(engine.resolveEffectTarget(alphaKiroshiOptics, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaKiroshiOptics.id,
    );
    expect(engine.getCard(alphaCorpoSecurity, "field", P2).meta.attachedGearIds).toHaveLength(0);
  });

  it("does not trigger below 7 Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaTBugAmateurPhilosopher,
            spent: false,
            playedThisTurn: false,
            attachedGears: [alphaDyingNightVSPistol],
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
      {
        field: [
          {
            card: alphaCorpoSecurity,
            spent: true,
            attachedGears: [alphaKiroshiOptics],
          },
        ],
      },
    );

    engine.attackRival(alphaTBugAmateurPhilosopher, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCard(alphaCorpoSecurity, "field", P2).meta.attachedGearIds).toHaveLength(1);
  });
});
