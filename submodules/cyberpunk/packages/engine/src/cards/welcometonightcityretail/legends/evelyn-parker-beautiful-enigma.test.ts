import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailEvelynParkerBeautifulEnigma,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Evelyn Parker - Beautiful Enigma", () => {
  it("readies 1 Eddie when a friendly Corpo Unit steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
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
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, playedThisTurn: false }],
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

  it("spends to make a rival Unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
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
        field: [
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, playedThisTurn: false },
        ],
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
