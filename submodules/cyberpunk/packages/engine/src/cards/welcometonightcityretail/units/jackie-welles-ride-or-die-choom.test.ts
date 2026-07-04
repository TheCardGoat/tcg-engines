import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Jackie Welles — Ride or Die Choom (retail)", () => {
  it("ATTACK grants +2 power this turn for each friendly even-valued Gig", () => {
    // Two even Gigs (d6=2, d8=4) → +4 power. Base 8 → effective 12.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
          { dieType: "d4", faceValue: 3 }, // odd — does not count
        ],
      },
      {},
    );

    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      "field",
      P1,
    );
    expect(getEffectivePower(engine.getState(), jackieId)).toBe(8);

    engine.attackRival(welcomeToNightCityRetailJackieWellesRideOrDieChoom, { as: P1 });

    expect(getEffectivePower(engine.getState(), jackieId)).toBe(12);
  });

  it("DEFEATED draws 1 for each friendly odd-valued Gig when defeated", () => {
    // Jackie (8) attacks Armored Minotaur (9 spent) → defenderWins → Jackie defeated.
    // Three odd Gigs (d4=1, d6=3, d8=5) → draw 3.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          alphaRuthlessLowlife,
          alphaRuthlessLowlife,
          alphaRuthlessLowlife,
          alphaRuthlessLowlife,
        ],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 7 }], // 2+7=9
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(welcomeToNightCityRetailJackieWellesRideOrDieChoom, alphaCorpoSecurity, {
      as: P1,
    });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P1 });

    // Jackie was defeated → defeated trigger drew 3.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 3);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
    );
  });

  it("ATTACK grants no bonus power when there are no friendly even Gigs", () => {
    // Empty Gig area → 0 even Gigs → +0 power. Base 8 stays 8.
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
          spent: false,
          playedThisTurn: false,
        },
      ],
    });

    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      "field",
      P1,
    );
    expect(getEffectivePower(engine.getState(), jackieId)).toBe(8);

    engine.attackRival(welcomeToNightCityRetailJackieWellesRideOrDieChoom, { as: P1 });

    expect(getEffectivePower(engine.getState(), jackieId)).toBe(8);
  });

  it("DEFEATED draws 0 when there are no friendly odd Gigs", () => {
    // Empty Gig area → 0 odd Gigs → draw 0 on defeat.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife, alphaRuthlessLowlife],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 7 }], // 2+7=9
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(welcomeToNightCityRetailJackieWellesRideOrDieChoom, alphaCorpoSecurity, {
      as: P1,
    });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P1 });

    // Jackie was defeated but no odd Gigs → defeated trigger drew 0.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
    );
  });
});
