import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJackedInVoodooBoy,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
  welcomeToNightCityRetailRebootOptics,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectAttackPair,
  expectNotAttackCandidate,
} from "../../../testing/index.ts";

describe("Jacked-In Voodoo Boy", () => {
  it("cannot attack until its controller has played a Program this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorporateSurveillance],
        field: [
          {
            card: welcomeToNightCityRetailJackedInVoodooBoy,
            spent: false,
            playedThisTurn: false,
          },
        ],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expectNotAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    expect(
      engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailJackedInVoodooBoy, {
          as: P1,
        }),
      ).errorCode,
    ).toBe("PROGRAM_NOT_PLAYED_THIS_TURN");

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expectAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    expect(engine.attackRival(welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 })).toMatchObject(
      {
        success: true,
      },
    );
  });

  it("can attack after a Program is played by another card's ability", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
          welcomeToNightCityRetailRebootOptics,
        ],
        field: [
          {
            card: welcomeToNightCityRetailJackedInVoodooBoy,
            spent: false,
            playedThisTurn: false,
          },
        ],
        eddies: 5,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    expectNotAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });

    engine.playCard(welcomeToNightCityRetailLizzyWizzyDelicateWeapon, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRebootOptics, {
      as: P1,
      allowPendingChoice: true,
      reason: "Lizzy Wizzy still needs the chosen Program to be confirmed for free play",
    });
    engine.resolveCardToPlay(welcomeToNightCityRetailRebootOptics, { as: P1 });

    expectAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    expectAttackPair(
      engine,
      welcomeToNightCityRetailJackedInVoodooBoy,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
  });

  it("does not carry a defensive QUICK Program into the defender's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
      },
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailJackedInVoodooBoy,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 2,
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P2 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    expect(engine.getActivePlayerId()).toBe(P1);
    engine.completeTurn({ as: P1 });

    expect(engine.getActivePlayerId()).toBe(P2);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P2 });
    expect(
      engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailJackedInVoodooBoy, {
          as: P2,
        }),
      ).errorCode,
    ).toBe("PROGRAM_NOT_PLAYED_THIS_TURN");
  });
});
