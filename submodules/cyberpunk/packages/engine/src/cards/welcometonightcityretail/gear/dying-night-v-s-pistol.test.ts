import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  alphaVCorporateExile,
  welcomeToNightCityRetailDyingNightVSPistol,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Dying Night — V's Pistol (retail) attack clause", () => {
  it("ATTACK decreases a Gig by up to 2", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: alphaSwordwiseHuscle,
            spent: false,
            playedThisTurn: false,
            attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
          },
        ],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );

    engine.attackRival(alphaSwordwiseHuscle, { as: P1 });

    // The attack clause suspends an adjustGig value choice. Resolve it by
    // setting the rival d8 to 4 (decrease by 2).
    engine.resolveAdjustGig(4, { as: P1 });

    const rivalDie = engine.getGigDice(P2)[0]!;
    expect(engine.getState().G.gigDice[rivalDie.id]!.faceValue).toBe(4);
  });

  it("readies 2 Eddies at end of turn when equipped to a Legend named 'V'", () => {
    // Printed text: 'At the end of your turn, if this Unit is named "V", ready
    // 2 Eddies.' alphaVCorporateExile has name "V".
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: alphaVCorporateExile,
          faceDown: false,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
      hand: [alphaRuthlessLowlife],
      eddies: 6,
    });

    // Play a 2-cost card to move 2 Eddies from `eddies` to `spentEddies`.
    engine.playCard(alphaRuthlessLowlife, { as: P1 });
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);

    // End turn — V legend condition matches → readyEddies(2) fires.
    engine.completeTurn({ as: P1 });

    // 2 spent Eddies readied back during the end-of-turn trigger window.
    expect(engine.getEddies(P1)).toBe(6);
    expect(engine.getState().G.players[P1].spentEddies).toBe(0);
  });

  it("does NOT ready Eddies at end of turn when equipped to a non-V host", () => {
    // alphaSwordwiseHuscle has name "Swordwise Huscle" → cardName condition fails.
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: alphaSwordwiseHuscle,
          spent: false,
          playedThisTurn: false,
          attachedGears: [welcomeToNightCityRetailDyingNightVSPistol],
        },
      ],
      hand: [alphaRuthlessLowlife],
      eddies: 6,
    });

    engine.playCard(alphaRuthlessLowlife, { as: P1 });
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);

    engine.completeTurn({ as: P1 });

    // No V legend → readyEddies does not fire → Eddies unchanged.
    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1].spentEddies).toBe(2);
  });
});
