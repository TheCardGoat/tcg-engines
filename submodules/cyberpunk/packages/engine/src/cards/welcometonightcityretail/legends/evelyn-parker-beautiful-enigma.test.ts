import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Evelyn Parker - Beautiful Enigma", () => {
  it("is the exact blue Doll Legend with a qualified steal trigger and paid must-attack ability", () => {
    const evelyn = welcomeToNightCityRetailEvelynParkerBeautifulEnigma;
    expect(evelyn).toMatchObject({
      canonicalId: "evelyn-parker-beautiful-enigma",
      slug: "evelyn-parker-beautiful-enigma",
      name: "Evelyn Parker",
      subname: "Beautiful Enigma",
      displayName: "Evelyn Parker: Beautiful Enigma",
      type: "legend",
      color: "blue",
      classifications: ["Doll"],
      cost: null,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "107",
      rulesText:
        "When a friendly CORPO or GANGER Unit steals 1 or more Gigs, ready 1 Eddie.\n1 €$, {Spend} A rival Unit must attack next turn if it can.",
    });
    expect(evelyn.abilities).toHaveLength(2);
    expect(evelyn.abilities[0]).toMatchObject({
      trigger: {
        trigger: "event",
        event: {
          event: "gigStolen",
          player: "friendly",
          minAmount: 1,
          source: {
            controller: "friendly",
            cardTypes: ["unit"],
            classifications: ["Corpo", "Ganger"],
          },
        },
      },
      effects: [{ effect: "readyEddies", player: "friendly", amount: 1 }],
    });
    expect(evelyn.abilities[1]).toMatchObject({
      trigger: { trigger: "activated" },
      bindings: [
        {
          target: {
            controller: "rival",
            cardTypes: ["unit"],
            selection: { min: 1, max: 1 },
          },
        },
      ],
      costs: [
        { cost: "payEddies", amount: 1 },
        { cost: "spend", target: { selector: "self" } },
      ],
      effects: [{ effect: "grantRule", rule: "mustAttack", duration: "untilSourceNextTurn" }],
    });
  });

  it("readies 1 Eddie when a friendly Corpo Unit steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
        ],
        eddies: 3,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.getState().G.players[P1]!.eddies = 2;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("does not ready an Eddie when a non-Corpo non-Ganger Unit steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
        ],
        eddies: 3,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.getState().G.players[P1]!.eddies = 2;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });

  it("readies only 1 Eddie when a friendly Ganger steals multiple Gigs at once", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailAnimalsWrecker,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [
          { card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma, faceDown: false },
        ],
        eddies: 3,
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 4 },
          { dieType: "d8", faceValue: 5 },
        ],
      },
    );
    engine.getState().G.players[P1]!.eddies = 1;
    engine.getState().G.players[P1]!.spentEddies = 2;

    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigDice(P1)).toHaveLength(2);
    expect(engine.getEvents("gigStolen")).toHaveLength(2);
    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });

  it("spends to make a rival Unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        legendArea: [
          {
            card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: false }],
      },
    );

    engine.activateAbility(welcomeToNightCityRetailEvelynParkerBeautifulEnigma, 1, { as: P1 });

    const forcedAttackerId = engine.findCardId(
      welcomeToNightCityRetailSwordwiseHuscle,
      "field",
      P2,
    );
    expect(getEffectiveRules(engine.getState(), forcedAttackerId)).toContain("mustAttack");
    expect(
      engine.getCard(welcomeToNightCityRetailEvelynParkerBeautifulEnigma, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    const cannotPass = engine.expectFailure(() => engine.completeTurn({ as: P2 }));
    expect(cannotPass.errorCode).toBe("MUST_ATTACK");

    engine.attackRival(welcomeToNightCityRetailSwordwiseHuscle, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    engine.completeTurn({ as: P2 });

    expect(getEffectiveRules(engine.getState(), forcedAttackerId)).not.toContain("mustAttack");
  });

  it("does not activate the must-attack ability when there is no rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });

    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailEvelynParkerBeautifulEnigma, 1, { as: P1 }),
    );

    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(
      engine.getCard(welcomeToNightCityRetailEvelynParkerBeautifulEnigma, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });
});
