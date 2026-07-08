import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackieWellesRideOrDieChoom,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Yorinobu Arasaka - Steel Dragon", () => {
  it("plays a cheap Unit for free and lets it attack rival Units this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          welcomeToNightCityRetailFieldOperator,
        ],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Yorinobu still needs the chosen Unit to be confirmed for free play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectiveRules(engine.getState(), fieldOperatorId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    expect(() =>
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    ).not.toThrow();
  });

  it("plays a cheap Unit from trash for free", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon],
      trash: [welcomeToNightCityRetailFieldOperator],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      zone: "trash",
      allowPendingChoice: true,
      reason: "Yorinobu still needs the chosen Unit from trash to be confirmed for free play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("skips the free-play effect when there is no valid Unit target", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailYorinobuArasakaSteelDragon,
        embracingPowerRetailStarterDeckMinotaur,
      ],
      eddies: 7,
    });

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: {
        type: "effectTarget",
        eligibleIds: [],
      },
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    engine.expectNoPendingChoice();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      embracingPowerRetailStarterDeckMinotaur.id,
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
    ]);
  });

  it("draws only for the first Arasaka Unit defeated each turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, playedThisTurn: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);

    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailFieldOperator.id,
        embracingPowerRetailStarterDeckMinotaur.id,
      ]),
    );
  });

  it("does not draw when a non-Arasaka Unit is defeated", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          welcomeToNightCityRetailYorinobuArasakaSteelDragon,
          {
            card: welcomeToNightCityRetailJackieWellesRideOrDieChoom,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 8 }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.attackUnit(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailJackieWellesRideOrDieChoom.id,
    );
  });
});
