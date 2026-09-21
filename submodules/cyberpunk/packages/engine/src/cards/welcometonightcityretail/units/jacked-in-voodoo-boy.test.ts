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
  it("is the exact blue Netrunner Voodoo Boys Unit with the continuous Program-play attack restriction", () => {
    expect(welcomeToNightCityRetailJackedInVoodooBoy).toMatchObject({
      canonicalId: "jacked-in-voodoo-boy",
      slug: "jacked-in-voodoo-boy",
      name: "Jacked-In Voodoo Boy",
      displayName: "Jacked-In Voodoo Boy",
      type: "unit",
      color: "blue",
      classifications: ["Netrunner", "Voodoo Boys"],
      cost: 2,
      power: 2,
      ram: 2,
      hasSellTag: false,
      printNumber: "115",
      rarity: "Common",
      rulesText: "This Unit can't attack unless you played a Program this turn.",
      abilities: [
        {
          kind: "static",
          text: "This Unit can't attack unless you played a Program this turn.",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "requiresProgramPlayedThisTurn",
              duration: "continuous",
            },
          ],
        },
      ],
    });
  });

  it("cannot attack until its controller has played a Program this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorporateSurveillance],
        field: [
          {
            card: welcomeToNightCityRetailJackedInVoodooBoy,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
        ],
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
    expect(
      engine.expectFailure(() =>
        engine.attackUnit(
          welcomeToNightCityRetailJackedInVoodooBoy,
          welcomeToNightCityRetailFieldOperator,
          { as: P1 },
        ),
      ).errorCode,
    ).toBe("PROGRAM_NOT_PLAYED_THIS_TURN");

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

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
            hasLag: false,
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
    engine.resolveEffectTarget(welcomeToNightCityRetailRebootOptics, { as: P1 });

    expectAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    expectAttackPair(
      engine,
      welcomeToNightCityRetailJackedInVoodooBoy,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailJackedInVoodooBoy,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    ).toMatchObject({ success: true });
  });

  it("does not unlock from a Program played by the Rival during this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailJackedInVoodooBoy, spent: false, hasLag: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        eddies: 2,
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P2 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    expectNotAttackCandidate(engine, welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 });
    expect(
      engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailJackedInVoodooBoy, { as: P1 }),
      ).errorCode,
    ).toBe("PROGRAM_NOT_PLAYED_THIS_TURN");
  });

  it("does not carry a defensive QUICK Program into the defender's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [
          {
            card: welcomeToNightCityRetailJackedInVoodooBoy,
            spent: false,
            hasLag: false,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        eddies: 2,
      },
      { autoGainGig: false },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.playCard(welcomeToNightCityRetailRebootOptics, { as: P2 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    expect(engine.getActivePlayerId()).toBe(P1);
    engine.completeTurn({ as: P1 });
    const gainChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!gainChoice || gainChoice.type !== "gainGig") {
      throw new Error("Expected the next player's start-of-turn Gig choice.");
    }
    engine.gainGig(gainChoice.payload.allowedDieIds[0]!, { as: P2 });

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
