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

describe("Nadia - Fighting Through Grief", () => {
  it("can attack the rival Gig area the turn she is played when behind on Gigs", () => {
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
    expect(engine.getGigCount(P1)).toBe(1);
    expect(engine.getGigCount(engine.getOpponentOf(P1))).toBe(2);
    expect(getEffectiveRules(engine.getState(), nadiaId)).toContain("canAttackRivalOnPlayedTurn");

    expectAttackCandidate(engine, welcomeToNightCityRetailNadiaFightingThroughGrief, {
      as: P1,
    });
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
