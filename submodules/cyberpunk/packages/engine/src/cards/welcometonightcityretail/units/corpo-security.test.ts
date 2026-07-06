import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaRuthlessLowlife,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2, expectNotAttackCandidate } from "../../../testing/index.ts";

describe("Corpo Security", () => {
  it("cannot attack even after lag is gone", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, playedThisTurn: false },
        ],
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expectNotAttackCandidate(engine, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
  });

  it("spends as BLOCKER to redirect a rival direct attack into a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
      {
        field: [{ card: alphaArmoredMinotaur, spent: false, playedThisTurn: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(alphaArmoredMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("enters play as a normal Unit but still keeps the cantAttack rule", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCorpoSecurity],
      field: [{ card: alphaRuthlessLowlife, spent: false, playedThisTurn: false }],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const security = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P1);
    expect(security.meta.playedThisTurn).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
  });
});
