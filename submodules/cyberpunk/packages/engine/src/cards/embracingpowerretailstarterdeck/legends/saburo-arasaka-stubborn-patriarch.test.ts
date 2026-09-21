import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { getProjectedDirectAttackGigStealCount } from "../../../moves/resolve-attack.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Saburo Arasaka - Stubborn Patriarch (Embracing Power retail starter)", () => {
  it("has the exact green Arasaka Corpo identity and attacking-only power effect", () => {
    expect(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch).toMatchObject({
      canonicalId: "saburo-arasaka-stubborn-patriarch",
      slug: "saburo-arasaka-stubborn-patriarch",
      name: "Saburo Arasaka",
      displayName: "Saburo Arasaka: Stubborn Patriarch",
      subname: "Stubborn Patriarch",
      type: "legend",
      color: "green",
      classifications: ["Arasaka", "Corpo"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      rarity: "Epic",
      printNumber: "013",
      rulesText:
        "Friendly ARASAKA Units have +1 power while attacking.\n(Units steal an extra Gig for every 10 power.)",
      reminderText: ["Units steal an extra Gig for every 10 power."],
      abilities: [
        {
          kind: "static",
          source: { selector: "self" },
          effects: [
            {
              effect: "modifyPower",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                classifications: ["Arasaka"],
              },
              value: 1,
              duration: "continuous",
              conditions: [{ condition: "attacking", target: { selector: "self" } }],
            },
          ],
        },
      ],
    });
  });

  it("gives a friendly Arasaka Unit +1 power while it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
            faceDown: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 1,
    );

    engine.resolveFullFight({ as: P1 });

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("crosses the 10-power breakpoint and steals exactly 2 Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
            faceDown: false,
          },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 4 },
        ],
      },
    );

    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P1 });
    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(2);
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({
      as: P1,
      gigIdsToSteal: engine.getGigDice(P2).map((die) => die.id),
    });

    expect(engine.getLastEvent("attackResolved")).toMatchObject({ gigsStolen: 2 });
    expect(engine.getGigDice(P1)).toHaveLength(2);
    expect(engine.getGigDice(P2)).toHaveLength(0);
  });

  it("does not boost a non-Arasaka Unit while it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
            faceDown: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const delamainId = engine.findCardId(welcomeToNightCityRetailDelamainCab, "field", P1);

    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });

    expect(getEffectivePower(engine.getState(), delamainId)).toBe(
      welcomeToNightCityRetailDelamainCab.power,
    );
  });

  it("does not boost a rival Arasaka Unit while it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
            faceDown: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );
    engine.completeTurn({ as: P1 });
    const rivalArasakaId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P2 },
    );

    expect(getEffectivePower(engine.getState(), rivalArasakaId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("does not boost a friendly Arasaka Unit while Saburo is face down", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          {
            card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
            faceDown: true,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });
});
