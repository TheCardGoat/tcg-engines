import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaVCorporateExile,
  alphaRuthlessLowlife,
  embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
  theHeistRetailStarterDeckDexterDeshawnOneLastChance,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOverTheEdge,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("new Cyberpunk card abilities", () => {
  it("Dexter DeShawn adjusts a Gig on play", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [theHeistRetailStarterDeckDexterDeshawnOneLastChance],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    engine.playCard(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], { as: P1 });
    engine.resolveAdjustGig(3, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(3);
  });

  it("Dexter DeShawn adjusts a Gig when attacking", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            playedThisTurn: false,
          },
        ],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 4 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckDexterDeshawnOneLastChance, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P2, "d8")], { as: P1 });
    engine.resolveAdjustGig(5, { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d8")?.faceValue).toBe(5);
  });

  it("Dexter DeShawn draws 2 when defeated with a 10+ Street Cred difference", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [alphaRuthlessLowlife, alphaRuthlessLowlife],
        field: [
          {
            card: theHeistRetailStarterDeckDexterDeshawnOneLastChance,
            spent: false,
            playedThisTurn: false,
          },
        ],
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 4 }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(theHeistRetailStarterDeckDexterDeshawnOneLastChance, alphaCorpoSecurity, {
      as: P1,
    });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(2);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      theHeistRetailStarterDeckDexterDeshawnOneLastChance.id,
    );
  });

  it("Field Operator draws on play only when friendly Street Cred is even", () => {
    const even = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [alphaRuthlessLowlife],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    even.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(even.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );

    const odd = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFieldOperator],
      deck: [alphaRuthlessLowlife],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    odd.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(odd.getCardsInZone("hand", P1)).toHaveLength(0);
  });

  it("Goro gains +5 power on attack when all friendly Legends are face-up", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
            spent: false,
            playedThisTurn: false,
          },
        ],
        legendArea: [{ card: alphaVCorporateExile, faceDown: false }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    const goroId = engine.findCardId(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay,
      "field",
      P1,
    );
    engine.attackUnit(embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay, alphaCorpoSecurity, {
      as: P1,
    });

    expect(getEffectivePower(engine.getState(), goroId)).toBe(
      embracingPowerRetailStarterDeckGoroTakemuraLosingHisWay.power + 5,
    );
  });

  it("Over the Edge defeats a Unit whose power is at most a friendly d20 value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailOverTheEdge],
        eddies: 3,
        gigArea: [{ dieType: "d20", faceValue: 3 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailOverTheEdge, { as: P1 });
    engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("Delamain Cab readies 1 Eddie at end of turn after stealing a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            playedThisTurn: false,
          },
        ],
        eddies: 4,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.getState().G.players[P1]!.eddies = 3;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEddies(P1)).toBe(3);

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("Viktor equips a cheap Cyberware Gear from trash to another friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [alphaRuthlessLowlife],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    engine.resolveCardToPlay(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });

    const host = engine.getCard(alphaRuthlessLowlife, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });
});
