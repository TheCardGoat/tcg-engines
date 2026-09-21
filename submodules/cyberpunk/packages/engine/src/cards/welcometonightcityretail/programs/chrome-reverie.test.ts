import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { enMessages, formatActionLog } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2, expectNotAttackCandidate } from "../../../testing/index.ts";

const reverie = welcomeToNightCityRetailChromeReverie;

describe("Chrome Reverie", () => {
  it("is a 3-cost blue Braindance Program with RAM 1, a Sell Tag, and exact printed effects", () => {
    expect(reverie).toMatchObject({
      type: "program",
      color: "blue",
      classifications: ["Braindance"],
      cost: 3,
      power: null,
      ram: 1,
      hasSellTag: true,
      timingTriggers: ["play"],
      reminderText: [
        "You can only Call a Legend once per turn.",
        "Discard programs after they resolve.",
      ],
    });
    expect(reverie.abilities).toEqual([
      expect.objectContaining({
        kind: "triggered",
        trigger: { trigger: "play" },
        effects: [
          {
            effect: "grantRule",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              selection: { mode: "choose", min: 1, max: 1 },
            },
            rule: "cantAttack",
            duration: "untilSourceNextTurn",
          },
          expect.objectContaining({
            effect: "callLegend",
            player: "friendly",
            free: true,
            optional: true,
            conditions: [{ condition: "hasMinGig", controller: "friendly" }],
          }),
        ],
      }),
    ]);
  });

  it("must choose exactly one rival field Unit and makes it unable to attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reverie],
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        legendArea: [],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.playCard(reverie, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected a Unit choice.");
    expect(choice.payload).toMatchObject({
      targetKind: "card",
      min: 1,
      max: 1,
      canDecline: false,
    });
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toEqual([welcomeToNightCityRetailFieldOperator.id]);

    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      reverie.id,
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    expectNotAttackCandidate(engine, welcomeToNightCityRetailFieldOperator, { as: P2 });
  });

  it("keeps the attack restriction through the Rival's turn and expires next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reverie],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        legendArea: [],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.playCard(reverie, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    const rivalUnit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(
      engine.getState().G.activeEffects.filter((effect) => effect.rule === "cantAttack"),
    ).toEqual([
      expect.objectContaining({
        duration: "untilSourceNextTurn",
        expiresAtStartOfTurnForPlayerId: P1,
      }),
    ]);

    for (let i = 0; i < 8 && engine.getActivePlayerId() !== P2; i++) {
      engine.passPhase({ as: engine.getActivePlayerId() });
    }
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(getEffectiveRules(engine.getState(), rivalUnit.instanceId as string)).toContain(
      "cantAttack",
    );

    for (let i = 0; i < 8 && engine.getActivePlayerId() !== P1; i++) {
      engine.passPhase({ as: engine.getActivePlayerId() });
    }
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(
      engine.getState().G.activeEffects.filter((effect) => effect.rule === "cantAttack"),
    ).toEqual([]);
    expect(getEffectiveRules(engine.getState(), rivalUnit.instanceId as string)).not.toContain(
      "cantAttack",
    );
  });

  it("may Call a Legend for free when it controls a min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [reverie],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      legendArea: [
        { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
      ],
    });

    engine.playCard(reverie, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected a Legend choice.");
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: true });
    engine.resolveEffectTarget(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, {
      as: P1,
    });

    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch).meta.faceDown,
    ).toBe(false);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);
  });

  it("still offers the free Call when there is no rival Unit to restrict", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [reverie],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      legendArea: [
        { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
      ],
    });

    engine.playCard(reverie, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected a Legend choice.");
    expect(choice.payload.eligibleIds).toContain(
      engine.findCardId(
        embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
        "legendArea",
        P1,
      ),
    );
  });

  it("does not Call for a non-min friendly Gig or a min rival Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reverie],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        legendArea: [
          { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );

    engine.playCard(reverie, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      engine.getCard(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch).meta.faceDown,
    ).toBe(true);
  });

  it("marks the free Call as the one allowed Call for the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [reverie],
      eddies: 4,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      legendArea: [
        { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
      ],
    });

    engine.playCard(reverie, { as: P1 });
    engine.resolveEffectTarget(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, {
      as: P1,
    });

    const failure = engine.expectFailure(() =>
      engine.callLegend(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 }),
    );
    expect(failure.errorCode).toBe("ALREADY_CALLED");
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("logs when it skips the free Legend call because a Legend was already called", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [reverie],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        legendArea: [
          { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
    );

    engine.callLegend(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, { as: P1 });
    engine.playCard(reverie, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    const skippedLog = engine
      .getEvents("actionLog")
      .find((event) => event.messageKey === "effect.callLegend.skippedAlreadyCalled");

    expect(skippedLog ? formatActionLog(skippedLog, enMessages) : "").toBe(
      "Chrome Reverie skipped calling a Legend because a Legend was already called this turn.",
    );
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.faceDown,
    ).toBe(true);
  });
});
