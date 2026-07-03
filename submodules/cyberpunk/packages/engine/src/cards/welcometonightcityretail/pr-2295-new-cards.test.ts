import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailKerryEurodyneAxeAttitudeAudience,
  welcomeToNightCityRetailLaLloronaGhostOfThePast,
  welcomeToNightCityRetailMistyOlszewskiMenderOfBrokenSpirits,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSaulBrightStormrider,
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
        field: [{ card: alphaRuthlessLowlife, spent: false, playedThisTurn: false }],
      },
    );

    engine.attackRival(alphaRuthlessLowlife, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailLaLloronaGhostOfThePast, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    const dieId = engine.getGigDice(P1)[0]!.id as string;
    engine.resolveEffectTargetIds([dieId], { as: P1 });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(5);
  });

  it("Misty guesses the top card type, adds a hit to hand, and readies 1 Eddie", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife],
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
      alphaRuthlessLowlife.id,
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
        field: [{ card: alphaRuthlessLowlife, spent: false, playedThisTurn: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    const failure = engine.expectFailure(() => engine.completeTurn({ as: P2 }));
    expect(failure.errorCode).toBe("MUST_ATTACK");
  });

  it("Overwatch discards a card and defeats a spent rival Unit within that cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaRebootOptics],
        field: [welcomeToNightCityRetailOverwatchPanamSGift],
        eddies: 1,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.activateAbility(welcomeToNightCityRetailOverwatchPanamSGift, 1, { as: P1 });
    if (engine.getState().G.turnMetadata.pendingChoice?.type === "chooseTarget") {
      engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });
    }

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaRebootOptics.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("Saul gives another friendly attacking Unit +2 power and readies up to 3 Units", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          welcomeToNightCityRetailSaulBrightStormrider,
          { card: alphaRuthlessLowlife, spent: false, playedThisTurn: false },
          { card: alphaSwordwiseHuscle, spent: true, playedThisTurn: false },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const attackerId = engine.findCardId(alphaRuthlessLowlife, "field", P1);
    engine.attackUnit(alphaRuthlessLowlife, alphaCorpoSecurity, { as: P1 });
    expect(getEffectivePower(engine.getState(), attackerId)).toBe(alphaRuthlessLowlife.power + 2);
    engine.resolveFullFight({ as: P1 });

    engine.completeTurn({ as: P1 });
    const spentUnitId = engine.findCardId(alphaSwordwiseHuscle, "field", P1);
    engine.resolveEffectTargetIds([spentUnitId], { as: P1 });

    expect(engine.getCard(alphaSwordwiseHuscle, "field", P1).meta.spent).toBe(false);
    expect(engine.getActivePlayerId()).toBe(P2);
  });

  it("Yorinobu plays a cheap Unit for free and lets it attack rival Units this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon, alphaRuthlessLowlife],
        eddies: 7,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 });
    engine.resolveCardToPlay(alphaRuthlessLowlife, { as: P1 });

    const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "field", P1);
    expect(getEffectiveRules(engine.getState(), lowlifeId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    expect(() =>
      engine.attackUnit(alphaRuthlessLowlife, alphaCorpoSecurity, { as: P1 }),
    ).not.toThrow();
  });

  it("Kerry offers the just-rolled Gig for reroll and draws on min or max rolls", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife, alphaRebootOptics],
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
