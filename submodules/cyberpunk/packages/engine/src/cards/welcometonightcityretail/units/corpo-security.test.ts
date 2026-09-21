import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectBlockerCandidate,
  expectNotAttackCandidate,
  expectNotAttackPair,
  expectNotBlockerCandidate,
} from "../../../testing/index.ts";

const security = welcomeToNightCityRetailCorpoSecurity;

describe("Corpo Security", () => {
  it("is a 2-cost 2-power green Corpo Unit with RAM 1, no Sell Tag, BLOCKER, and cantAttack", () => {
    expect(security).toMatchObject({
      type: "unit",
      color: "green",
      classifications: ["Corpo"],
      cost: 2,
      power: 2,
      ram: 1,
      hasSellTag: false,
      keywords: ["blocker"],
    });
    expect(security.abilities).toEqual([
      {
        kind: "keyword",
        text: "Blocker (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
        keyword: "blocker",
        source: { selector: "self" },
        effects: [],
      },
      {
        kind: "static",
        text: "This Unit can't attack.",
        effects: [
          {
            effect: "grantRule",
            target: { selector: "self" },
            rule: "cantAttack",
            duration: "continuous",
          },
        ],
      },
    ]);
  });

  it("cannot attack either a rival Unit or the rival Gig area even while ready without Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: security, spent: false, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    expectNotAttackCandidate(engine, security, { as: P1 });
    expectNotAttackPair(engine, security, welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.expectFailure(() => engine.attackRival(security, { as: P1 })).errorCode).toBe(
      "CANT_ATTACK",
    );
    expect(
      engine.expectFailure(() =>
        engine.attackUnit(security, welcomeToNightCityRetailFieldOperator, { as: P1 }),
      ).errorCode,
    ).toBe("CANT_ATTACK");
  });

  it("can use BLOCKER while lagging, spends, and redirects a rival direct attack into a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: security, spent: false, hasLag: true }],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expectBlockerCandidate(engine, security, { as: P1 });
    engine.useBlocker(security, { as: P1 });

    const securityId = engine.findCardId(security, "field", P1);
    expect(engine.getCard(security, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      step: "react",
      defenderId: securityId,
      redirectedByBlocker: true,
    });
  });

  it("redirects an attack from another friendly Unit and fully replaces that defender", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: security, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false },
        ],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailFieldOperator,
      {
        as: P2,
      },
    );
    engine.resolveAttack({ as: P2 });
    const originalDefenderId = engine.findCardId(
      welcomeToNightCityRetailFieldOperator,
      "field",
      P1,
    );
    engine.useBlocker(security, { as: P1 });

    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(security, "field", P1),
      redirectedByBlocker: true,
    });
    expect(engine.getState().G.attackState?.defenderId).not.toBe(originalDefenderId);
  });

  it("cannot use BLOCKER while spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: security, spent: true, hasLag: false }] },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });

    expectNotBlockerCandidate(engine, security, { as: P1 });
    expect(engine.expectFailure(() => engine.useBlocker(security, { as: P1 })).errorCode).toBe(
      "CARD_SPENT",
    );
  });

  it("may decline BLOCKER and leave the original direct attack unchanged", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: security, spent: false, hasLag: false }] },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expectBlockerCandidate(engine, security, { as: P1 });
    engine.resolveAttack({ as: P1, pass: true });

    expect(engine.getCard(security, "field", P1).meta.spent).toBe(false);
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "direct",
      step: "steal",
    });
    expect(engine.getState().G.attackState?.redirectedByBlocker).toBeUndefined();
  });

  it("pays 2 Eddies, enters with Lag, and keeps the continuous cantAttack rule", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [security],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [],
      eddies: 2,
    });

    expect(engine.playCard(security, { as: P1 })).toMatchObject({ success: true });

    const playedSecurity = engine.getCard(security, "field", P1);
    expect(playedSecurity.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expectNotAttackCandidate(engine, security, { as: P1 });
  });
});
