import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailLizzyWizzyDelicateWeapon,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../active-effects/index.ts";
import { enMessages, formatActionLog } from "../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2, expectNotAttackCandidate } from "../../testing/index.ts";

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

const lizzy = welcomeToNightCityRetailLizzyWizzyDelicateWeapon;
const saburo = embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch;
const goro = embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean;
const rivalUnit = welcomeToNightCityRetailFieldOperator;

const missingRivalUnitLog = "Chrome Reverie's grant rule effect had no valid targets.";
const missingLegendLog = "Chrome Reverie's call legend effect had no valid targets.";
const alreadyCalledLog =
  "Chrome Reverie skipped calling a Legend because a Legend was already called this turn.";
const restrictedUnitLog =
  "Chrome Reverie made Field Operator unable to attack until your next turn.";
const calledLegendLog = "Chrome Reverie called Saburo Arasaka: Stubborn Patriarch for free.";

type LegendAvailability = "faceUp" | "faceDownNotCalled" | "faceDownAlreadyCalled";

function actionLogLines(engine: CyberpunkTestEngine): string[] {
  return engine.getEvents("actionLog").map((event) => formatActionLog(event, enMessages));
}

function chromeReverieFromLizzy(opts: {
  rivalUnit: boolean;
  legend: LegendAvailability;
}): CyberpunkTestEngine {
  const alreadyCalled = opts.legend === "faceDownAlreadyCalled";
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      hand: [lizzy, reverie],
      eddies: alreadyCalled ? 6 : 5,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      legendArea: alreadyCalled
        ? [
            { card: saburo, faceDown: true },
            { card: goro, faceDown: true },
          ]
        : [{ card: saburo, faceDown: opts.legend === "faceDownNotCalled" }],
    },
    opts.rivalUnit ? { field: [{ card: rivalUnit, spent: false, hasLag: false }] } : {},
  );
  if (alreadyCalled) {
    engine.callLegend(saburo, { as: P1 });
  }
  return engine;
}

function playLizzyAndChooseChrome(
  engine: CyberpunkTestEngine,
  opts: { allowPendingChoice: true; reason: string } | { allowPendingChoice?: false },
) {
  engine.playCard(lizzy, { as: P1 });
  if (opts.allowPendingChoice) {
    return engine.resolveEffectTarget(reverie, {
      as: P1,
      allowPendingChoice: true,
      reason: opts.reason,
    });
  }
  return engine.resolveEffectTarget(reverie, { as: P1 });
}

function expectChromeBottomDecked(engine: CyberpunkTestEngine): void {
  expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(lizzy.id);
  expect(
    engine
      .getCardsInZone("deck", P1)
      .map((card) => card.definitionId)
      .at(-1),
  ).toBe(reverie.id);
  expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).not.toContain(
    reverie.id,
  );
  expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
    reverie.id,
  );
}

function expectNoAttackRestriction(engine: CyberpunkTestEngine): void {
  expect(
    engine.getState().G.activeEffects.filter((effect) => effect.rule === "cantAttack"),
  ).toEqual([]);
}

function expectAttackRestriction(engine: CyberpunkTestEngine): void {
  const unit = engine.getCard(rivalUnit, "field", P2);
  expect(getEffectiveRules(engine.getState(), unit.instanceId as string)).toContain("cantAttack");
}

describe("Lizzy Wizzy plays Chrome Reverie with a min Gig", () => {
  it("restricts a rival Unit and Calls a face-down Legend that has not been called this turn", () => {
    const engine = chromeReverieFromLizzy({ rivalUnit: true, legend: "faceDownNotCalled" });

    playLizzyAndChooseChrome(engine, {
      allowPendingChoice: true,
      reason: "Chrome Reverie chooses its rival Unit before the free Call",
    });
    engine.resolveEffectTarget(rivalUnit, {
      as: P1,
      allowPendingChoice: true,
      reason: "Chrome Reverie offers the free Call after the Unit is chosen",
    });
    const legendChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(legendChoice?.type).toBe("chooseTarget");
    if (!legendChoice || legendChoice.type !== "chooseTarget") {
      throw new Error("Expected the free Call choice.");
    }
    expect(legendChoice.payload).toMatchObject({ min: 1, max: 1, canDecline: true });
    expect(legendChoice.payload.eligibleIds).toEqual([engine.findCardId(saburo, "legendArea", P1)]);

    engine.resolveEffectTarget(saburo, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(saburo).meta.faceDown).toBe(false);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);
    expectAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    const lines = actionLogLines(engine);
    expect(lines).toEqual(expect.arrayContaining([restrictedUnitLog, calledLegendLog]));
    expect(lines).not.toContain(missingRivalUnitLog);
    expect(lines).not.toContain(missingLegendLog);
    expect(lines).not.toContain(alreadyCalledLog);
  });

  it("restricts a rival Unit and logs that a face-up Legend cannot be Called", () => {
    const engine = chromeReverieFromLizzy({ rivalUnit: true, legend: "faceUp" });

    playLizzyAndChooseChrome(engine, {
      allowPendingChoice: true,
      reason: "Chrome Reverie still chooses a rival Unit when every Legend is face up",
    });
    engine.resolveEffectTarget(rivalUnit, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(saburo).meta.faceDown).toBe(false);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(false);
    expectAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    expect(actionLogLines(engine)).toContain(missingLegendLog);
    expect(actionLogLines(engine)).toContain(restrictedUnitLog);
    expect(actionLogLines(engine)).not.toContain(alreadyCalledLog);
    expect(actionLogLines(engine)).not.toContain(missingRivalUnitLog);
  });

  it("restricts a rival Unit and logs that the free Call was already used this turn", () => {
    const engine = chromeReverieFromLizzy({ rivalUnit: true, legend: "faceDownAlreadyCalled" });

    playLizzyAndChooseChrome(engine, {
      allowPendingChoice: true,
      reason: "Chrome Reverie still chooses a rival Unit after a Legend was called",
    });
    engine.resolveEffectTarget(rivalUnit, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(goro).meta.faceDown).toBe(true);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);
    expectAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    expect(actionLogLines(engine)).toContain(alreadyCalledLog);
    expect(actionLogLines(engine)).toContain(restrictedUnitLog);
    expect(actionLogLines(engine)).not.toContain(missingLegendLog);
    expect(actionLogLines(engine)).not.toContain(missingRivalUnitLog);
  });

  it("logs the missing rival Unit and still Calls a face-down Legend", () => {
    const engine = chromeReverieFromLizzy({ rivalUnit: false, legend: "faceDownNotCalled" });

    playLizzyAndChooseChrome(engine, {
      allowPendingChoice: true,
      reason: "the free Call remains after the rival Unit instruction has no target",
    });
    const legendChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(legendChoice?.type).toBe("chooseTarget");
    if (!legendChoice || legendChoice.type !== "chooseTarget") {
      throw new Error("Expected the free Call choice.");
    }
    expect(legendChoice.payload.eligibleIds).toEqual([engine.findCardId(saburo, "legendArea", P1)]);
    expect(legendChoice.payload.canDecline).toBe(true);
    expect(actionLogLines(engine)).toContain(missingRivalUnitLog);

    engine.resolveEffectTarget(saburo, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(saburo).meta.faceDown).toBe(false);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);
    expectNoAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    expect(actionLogLines(engine)).toContain(calledLegendLog);
    expect(actionLogLines(engine)).not.toContain(missingLegendLog);
    expect(actionLogLines(engine)).not.toContain(alreadyCalledLog);
  });

  it("logs both a missing rival Unit and a face-up Legend", () => {
    const engine = chromeReverieFromLizzy({ rivalUnit: false, legend: "faceUp" });

    playLizzyAndChooseChrome(engine, {});

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(saburo).meta.faceDown).toBe(false);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(false);
    expectNoAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    expect(actionLogLines(engine)).toEqual(
      expect.arrayContaining([missingRivalUnitLog, missingLegendLog]),
    );
    expect(actionLogLines(engine)).not.toContain(alreadyCalledLog);
    expect(actionLogLines(engine)).not.toContain(calledLegendLog);
    expect(actionLogLines(engine)).not.toContain(restrictedUnitLog);
  });

  it("logs a missing rival Unit and a free Call skipped because a Legend was already called", () => {
    const engine = chromeReverieFromLizzy({
      rivalUnit: false,
      legend: "faceDownAlreadyCalled",
    });

    playLizzyAndChooseChrome(engine, {});

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(saburo).meta.faceDown).toBe(false);
    expect(engine.getCard(goro).meta.faceDown).toBe(true);
    expect(engine.getState().G.players[P1]!.calledLegendThisTurn).toBe(true);
    expectNoAttackRestriction(engine);
    expectChromeBottomDecked(engine);
    expect(actionLogLines(engine)).toEqual(
      expect.arrayContaining([missingRivalUnitLog, alreadyCalledLog]),
    );
    expect(actionLogLines(engine)).not.toContain(missingLegendLog);
    expect(actionLogLines(engine)).not.toContain(calledLegendLog);
    expect(actionLogLines(engine)).not.toContain(restrictedUnitLog);
  });
});
