import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailMaxtacSuppressionTeam,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "../../../testing/index.ts";

describe("MaxTac Suppression Team", () => {
  it("is the exact yellow 5-cost 7-power NCPD Unit with a continuous rival-Lag restriction", () => {
    const card = welcomeToNightCityRetailMaxtacSuppressionTeam;
    expect(card).toMatchObject({
      canonicalId: "maxtac-suppression-team",
      slug: "maxtac-suppression-team",
      name: "MaxTac Suppression Team",
      displayName: "MaxTac Suppression Team",
      type: "unit",
      color: "yellow",
      classifications: ["NCPD"],
      cost: 5,
      power: 7,
      ram: 1,
      hasSellTag: false,
      printNumber: "050",
      rulesText: "Rival Units can't attack the turn they're played.",
    });
    expect(card.abilities).toEqual([
      expect.objectContaining({
        kind: "static",
        effects: [
          {
            effect: "grantRule",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              hasLag: true,
            },
            rule: "cantAttack",
            duration: "continuous",
          },
        ],
      }),
    ]);
  });

  it("plays as a normal unit with lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMaxtacSuppressionTeam],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailMaxtacSuppressionTeam, { as: P1 });

    const maxTac = engine.getCard(welcomeToNightCityRetailMaxtacSuppressionTeam, "field", P1);
    expect(maxTac.meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("prevents a rival ADRENALINE Unit played while MaxTac is on the field from attacking", () => {
    // Riding Nomad has ADRENALINE and would otherwise attack the turn it's played.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailMaxtacSuppressionTeam,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 4,
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P2 });

    expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 }),
    );
    expect(failure.errorCode).toBe("CANT_ATTACK");
  });

  it("also prevents a rival ADRENALINE Unit already carrying Lag when MaxTac is present", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailMaxtacSuppressionTeam,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: true }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
    const failure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 }),
    );
    expect(failure.errorCode).toBe("CANT_ATTACK");
  });

  it("does not restrict a friendly ADRENALINE Unit carrying Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailMaxtacSuppressionTeam, spent: false, hasLag: false },
        { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: true },
      ],
    });

    expectAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P1 });
    expect(engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 }).success).toBe(true);
  });

  it("does not prevent a friendly Legend from using GO SOLO and attacking that turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: welcomeToNightCityRetailMaxtacSuppressionTeam, spent: false, hasLag: false },
      ],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 5,
    });
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    expect(engine.executeMove("goSolo", { args: { cardId: vId } }, P1).success).toBe(true);
    expectAttackCandidate(engine, welcomeToNightCityRetailVStreetkid, { as: P1 });
    expect(engine.attackRival(welcomeToNightCityRetailVStreetkid, { as: P1 }).success).toBe(true);
  });

  it("does not restrict a rival Unit after its played-turn Lag has cleared", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailMaxtacSuppressionTeam, spent: false, hasLag: false },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    expectAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
    expect(engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 }).success).toBe(true);
  });

  it("stops restricting the rival Unit as soon as MaxTac leaves the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailMaxtacSuppressionTeam, spent: true, hasLag: false },
        ],
      },
      {
        field: [
          { card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: true },
        ],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });

    engine.attackUnit(
      embracingPowerRetailStarterDeckMinotaur,
      welcomeToNightCityRetailMaxtacSuppressionTeam,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaxtacSuppressionTeam.id,
    );
    expectAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
  });
});
