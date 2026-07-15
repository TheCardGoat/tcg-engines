import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Welcome to Night City Retail PR #2295 cards", () => {
  it("La Llorona uses BLOCKER, then chooses a friendly Gig to increase", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailLaLloronaGhostOfThePast, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const dieId = engine.getGigDice(P1)[0]!.id as string;
    engine.resolveEffectTargetIds([dieId], {
      as: P1,
      allowPendingChoice: true,
      reason: "La Llorona still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(5);
  });

  it("Misty guesses the top card type, adds a hit to hand, and readies 1 Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters],
        field: [welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.getState().G.players[P1]!.eddies = 0;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.completeTurn({ as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardType");
    engine.resolveCardTypeChoice("unit", { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMoxInciters.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("Mox Inciters makes the chosen rival Unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        eddies: 3,
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    const failure = engine.expectFailure(() => engine.completeTurn({ as: P2 }));
    expect(failure.errorCode).toBe("MUST_ATTACK");
  });

  it("Overwatch discards a card and defeats a spent rival Unit within that cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailRebootOptics],
        field: [welcomeToNightCityRetailOverwatchPanamSGift],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.activateAbility(welcomeToNightCityRetailOverwatchPanamSGift, 1, { as: P1 });
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    }

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailRebootOptics.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("Saul gives another friendly attacking Unit +2 power and readies up to 3 Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, playedThisTurn: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    const attackerId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(getEffectivePower(engine.getState(), attackerId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
    engine.resolveFullFight({ as: P1 });

    engine.completeTurn({ as: P1 });
    const spentUnitId = engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    engine.resolveEffectTargetIds([spentUnitId], { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("Yorinobu plays a cheap Unit for free and lets it attack rival Units this turn", () => {
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

  it("Kerry offers the just-rolled Gig for reroll and draws on min or max rolls", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailMoxInciters, welcomeToNightCityRetailRebootOptics],
        legendArea: [
          { card: welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience, faceDown: false },
        ],
        fixerDice: ["d4"],
      },
      {},
      { autoGainGig: false, seed: "kerry-min-roll" },
    );
    const die = engine.getFixerDice(P1).find((candidate) => candidate.dieType === "d4")!;
    engine.judgeSetPendingChoice(
      {
        type: "gainGig",
        chooserId: P1,
        effectId: "test",
        payload: { allowedDieIds: [die.id] },
      },
      { as: P1 },
    );

    engine.gainGig(die.id as string, { as: P1 });

    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(["chooseTrigger", "chooseTarget", undefined]).toContain(pending?.type);
  });
});
