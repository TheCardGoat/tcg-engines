import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  welcomeToNightCityRetailAdrenalineConverter,
  welcomeToNightCityRetailEmergencyAtlus,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMaxtacHeavy,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, expectAttackCandidate, P1, P2 } from "../../../testing/index.ts";

const converter = welcomeToNightCityRetailAdrenalineConverter;

describe("Adrenaline Converter", () => {
  /**
   * Oracle: Gear costs 2 €$ and gives its host its printed 3 power (CR 3.17.3,
   * 11.6.5). At exactly a two-Gig deficit its continuous condition grants the
   * host ADRENALINE, allowing the freshly played lagging Unit to attack (CR
   * 4.11.3, 11.6.4, 11.23.1-2). The condition is directional and false at a
   * one-Gig deficit or when the friendly player is ahead.
   */
  it("pays 2, grants Adrenaline at exactly a two-Gig deficit, and adds 3 power in combat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator, converter],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: true }],
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.attachGear(converter, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);

    expect(
      engine.attackUnit(
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailEmergencyAtlus,
        { as: P1 },
      ).success,
    ).toBe(true);
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1)).toBeDefined();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailEmergencyAtlus.id,
    );
  });

  it("does not grant Adrenaline at only a one-Gig deficit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator, converter],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
        ],
      },
    );
    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.attachGear(converter, welcomeToNightCityRetailFieldOperator, { as: P1 });

    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 }),
    );

    expect(failure.errorCode).toBe("LAG");
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      false,
    );
  });

  it("does not grant Adrenaline when its controller has two more Gigs than the Rival", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator, converter],
        eddies: 5,
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.attachGear(converter, welcomeToNightCityRetailFieldOperator, { as: P1 });

    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 }),
    );

    expect(failure.errorCode).toBe("LAG");
  });

  it("continuously loses Adrenaline when another friendly Unit closes the Gig gap", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: true,
            attachedGears: [converter],
          },
          { card: welcomeToNightCityRetailMaxtacHeavy, spent: false, hasLag: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
    );
    const gigToSteal = engine.getGigDice(P2).find((die) => die.dieType === "d6");
    if (!gigToSteal) throw new Error("Expected a rival d6 Gig");
    expectAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailMaxtacHeavy, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [gigToSteal.id as string] });

    expect(engine.getGigCount(P1)).toBe(2);
    expect(engine.getGigCount(P2)).toBe(2);
    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 }),
    );
    expect(failure.errorCode).toBe("LAG");
  });

  it("can be paid for and equipped to a friendly face-up Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [converter],
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
      ],
      eddies: 2,
    });

    engine.attachGear(converter, embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, {
      as: P1,
    });

    const host = engine.getCard(
      embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
      "legendArea",
      P1,
    );
    const gear = engine.getCard(converter, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(gear.meta.attachedToId).toBe(host.instanceId);
  });

  it("rejects a face-down friendly Legend and a rival Unit as attachment hosts", () => {
    const faceDownEngine = CyberpunkTestEngine.createWithFixture({
      hand: [converter],
      legendArea: [
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
      ],
      eddies: 2,
    });
    const faceDownFailure = faceDownEngine.expectFailure(() =>
      faceDownEngine.attachGear(
        converter,
        embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
        { as: P1 },
      ),
    );
    expect(faceDownFailure.errorCode).toBe("INVALID_CHOICE");
    expect(faceDownEngine.getEddies(P1)).toBe(2);
    expect(faceDownEngine.getCard(converter, "hand", P1)).toBeDefined();

    const rivalEngine = CyberpunkTestEngine.createWithFixture(
      { hand: [converter], eddies: 2 },
      { field: [{ card: welcomeToNightCityRetailEmergencyAtlus, spent: false }] },
    );
    const rivalFailure = rivalEngine.expectFailure(() =>
      rivalEngine.attachGear(converter, welcomeToNightCityRetailEmergencyAtlus, { as: P1 }),
    );
    expect(rivalFailure.errorCode).toBe("INVALID_CHOICE");
    expect(rivalEngine.getEddies(P1)).toBe(2);
    expect(rivalEngine.getCard(converter, "hand", P1)).toBeDefined();
  });
});
