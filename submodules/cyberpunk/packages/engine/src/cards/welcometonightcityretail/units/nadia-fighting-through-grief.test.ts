import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailNadiaFightingThroughGrief,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  expectAttackCandidate,
  expectNotAttackPair,
  expectNotAttackCandidate,
} from "../../../testing/index.ts";

const nadia = welcomeToNightCityRetailNadiaFightingThroughGrief;

describe("Nadia - Fighting Through Grief", () => {
  it("is the exact green 6-cost 8-power Trauma Team Medtech with conditional Gig-area haste", () => {
    expect(nadia).toMatchObject({
      canonicalId: "nadia-fighting-through-grief",
      slug: "nadia-fighting-through-grief",
      name: "Nadia",
      subname: "Fighting Through Grief",
      displayName: "Nadia: Fighting Through Grief",
      type: "unit",
      color: "green",
      classifications: ["Medtech", "Trauma Team"],
      cost: 6,
      power: 8,
      ram: 2,
      hasSellTag: false,
      printNumber: "083",
      rulesText:
        "If a Rival controls more Gigs than you, this Unit can attack their Gig area the turn it's played.",
      abilities: [
        {
          kind: "static",
          text: "If a Rival controls more Gigs than you, this Unit can attack their Gig area the turn it's played.",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "canAttackRivalOnPlayedTurn",
              duration: "continuous",
              conditions: [
                { condition: "hasLag", target: { selector: "self" } },
                {
                  condition: "gigCountComparison",
                  controller: "rival",
                  comparison: "gt",
                  other: "friendly",
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays 6 and attacks the rival Gig area on the played turn when behind on Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [nadia],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );

    engine.playCard(nadia, { as: P1 });

    const nadiaId = engine.findCardId(nadia, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(nadia, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(engine.getOpponentOf(P1))).toBe(2);
    expect(getEffectiveRules(engine.getState(), nadiaId)).toContain("canAttackRivalOnPlayedTurn");

    expectAttackCandidate(engine, nadia, { as: P1 });
    expect(engine.attackRival(nadia, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCard(nadia, "field", P1).meta.spent).toBe(true);
  });

  it("cannot attack the rival Gig area the turn she is played when not behind on Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailNadiaFightingThroughGrief,
            spent: false,
            hasLag: true,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P1 }, { as: P1 });
    engine.judgeSetPendingChoice(undefined, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expectNotAttackCandidate(engine, welcomeToNightCityRetailNadiaFightingThroughGrief, {
      as: P1,
    });
  });

  it("cannot attack the rival Gig area on the played turn when ahead on Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: nadia, spent: false, hasLag: true }],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
    );
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expectNotAttackCandidate(engine, nadia, { as: P1 });
    expect(engine.expectFailure(() => engine.attackRival(nadia, { as: P1 })).errorCode).toBe("LAG");
  });

  it("can attack from zero Gigs when the Rival controls one Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: nadia, spent: false, hasLag: true }] },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expectAttackCandidate(engine, nadia, { as: P1 });
    expect(engine.attackRival(nadia, { as: P1 })).toMatchObject({ success: true });
  });

  it("does not retain the special played-turn rule after Lag is gone", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: nadia, spent: false, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    engine.judgeRecomputeActiveEffects({ as: P1 });
    const nadiaId = engine.findCardId(nadia, "field", P1);

    expect(getEffectiveRules(engine.getState(), nadiaId)).not.toContain(
      "canAttackRivalOnPlayedTurn",
    );
    expectAttackCandidate(engine, nadia, { as: P1 });
  });

  it("does not gain full adrenaline for attacking rival Units the turn she is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailNadiaFightingThroughGrief,
            spent: false,
            hasLag: true,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P1 }, { as: P1 });
    engine.judgeSetPendingChoice(undefined, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    expectNotAttackPair(
      engine,
      welcomeToNightCityRetailNadiaFightingThroughGrief,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expectAttackCandidate(engine, welcomeToNightCityRetailNadiaFightingThroughGrief, {
      as: P1,
    });
  });

  it("stays in attackRival prompt candidates when another effect also permits played-turn unit attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailNadiaFightingThroughGrief,
            spent: false,
            hasLag: true,
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P1 }, { as: P1 });
    engine.judgeSetPendingChoice(undefined, { as: P1 });
    engine.judgeRecomputeActiveEffects({ as: P1 });

    const nadiaId = engine.findCardId(
      welcomeToNightCityRetailNadiaFightingThroughGrief,
      "field",
      P1,
    );
    engine.judgeAddActiveEffect(
      {
        id: "unit-attack-permission",
        sourceCardId: nadiaId,
        targetCardId: nadiaId,
        kind: "grantRule",
        rule: "canAttackOnPlayedTurnAgainstUnits",
        duration: "turn",
        origin: "imperative",
        abilityIndex: 0,
      },
      { as: P1 },
    );

    expect(getEffectiveRules(engine.getState(), nadiaId)).toEqual(
      expect.arrayContaining(["canAttackRivalOnPlayedTurn", "canAttackOnPlayedTurnAgainstUnits"]),
    );
    expectAttackCandidate(engine, welcomeToNightCityRetailNadiaFightingThroughGrief, {
      as: P1,
    });
  });
});
