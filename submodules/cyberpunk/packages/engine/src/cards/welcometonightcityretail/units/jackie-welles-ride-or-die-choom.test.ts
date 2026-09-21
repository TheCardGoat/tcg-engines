import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const jackie = welcomeToNightCityRetailJackieWellesRideOrDieChoom;

describe("Jackie Welles — Ride or Die Choom (retail)", () => {
  it("is the exact yellow Merc Valentino Unit with Attack and Defeated parity effects", () => {
    expect(jackie).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Merc", "Valentino"],
      cost: 6,
      power: 8,
      ram: 2,
      printNumber: "048",
      timingTriggers: ["attack"],
    });
    expect(jackie.abilities).toHaveLength(2);
    expect(jackie.abilities[0]).toMatchObject({
      kind: "triggered",
      trigger: { trigger: "attack" },
      effects: [
        {
          effect: "modifyPower",
          value: {
            type: "perCount",
            multiplier: 2,
            target: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
              valueParity: "even",
            },
          },
          duration: "turn",
        },
      ],
    });
    expect(jackie.abilities[1]).toMatchObject({
      kind: "triggered",
      trigger: { trigger: "defeated" },
      effects: [
        {
          effect: "draw",
          player: "friendly",
          amount: {
            type: "perCount",
            multiplier: 1,
            target: {
              selector: "gig",
              controller: "friendly",
              amount: "all",
              valueParity: "odd",
            },
          },
        },
      ],
    });
  });

  it("ATTACK grants +2 power this turn for each friendly even-valued Gig", () => {
    // Two even Gigs (d6=2, d8=4) → +4 power. Base 8 → effective 12.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
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
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 7 }], // 2+7=9
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

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
          hasLag: false,
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

  it("ATTACK ignores rival even-valued Gigs and friendly odd-valued Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: jackie, spent: false, hasLag: false }],
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d10", faceValue: 8 },
        ],
      },
    );
    const jackieId = engine.findCardId(jackie, "field", P1);

    engine.attackRival(jackie, { as: P1 });

    expect(getEffectivePower(engine.getState(), jackieId)).toBe(10);
  });

  it("removes the ATTACK power bonus at the end of the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: jackie, spent: false, hasLag: false }],
      gigArea: [
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 4 },
      ],
    });
    const jackieId = engine.findCardId(jackie, "field", P1);

    engine.attackRival(jackie, { as: P1 });
    expect(getEffectivePower(engine.getState(), jackieId)).toBe(12);

    engine.resolveFullSteal({ as: P1 });
    engine.completeTurn({ as: P1 });

    expect(getEffectivePower(engine.getState(), jackieId)).toBe(8);
  });

  it("DEFEATED draws 0 when there are no friendly odd Gigs", () => {
    // Empty Gig area → 0 odd Gigs → draw 0 on defeat.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 7 }], // 2+7=9
      },
    );

    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    // Jackie was defeated but no odd Gigs → defeated trigger drew 0.
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
    );
  });

  it("DEFEATED counts only friendly odd-valued Gigs in a mixed board", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
        ],
        field: [{ card: jackie, spent: false, hasLag: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 13 }],
        gigArea: [
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 5 },
        ],
      },
    );
    const handBefore = engine.getCardsInZone("hand", P1).length;

    engine.attackUnit(jackie, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore + 1);
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
  });
});
