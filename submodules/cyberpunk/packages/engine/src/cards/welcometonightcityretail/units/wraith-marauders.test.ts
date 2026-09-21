import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailWraithMarauders,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const wraith = welcomeToNightCityRetailWraithMarauders;

describe("Wraith Marauders retail printing", () => {
  it("has the exact green Ganger Nomad Raffen Shiv identity and steal trigger DSL", () => {
    expect(wraith).toMatchObject({
      canonicalId: "wraith-marauders",
      slug: "wraith-marauders",
      name: "Wraith Marauders",
      displayName: "Wraith Marauders",
      type: "unit",
      color: "green",
      classifications: ["Ganger", "Nomad", "Raffen Shiv"],
      cost: 5,
      power: 4,
      ram: 2,
      hasSellTag: false,
      rarity: "Uncommon",
      printNumber: "092",
      rulesText:
        "When this Unit steals a Gig, ready another friendly Unit with power equal to the Gig's value.",
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              player: "friendly",
              target: { selector: "gig", controller: "rival" },
              minAmount: 1,
              source: { selector: "self" },
            },
          },
          source: { selector: "self" },
          effects: [
            {
              effect: "ready",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                excludeSelf: true,
                powerEqualsGigValueOf: { selector: "context", key: "triggeredGigs" },
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 5, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [wraith], eddies: 5 });
    success.spendAllLegends();
    success.playCard(wraith, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(wraith, "field", P1).meta.hasLag).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [wraith], eddies: 4 });
    short.spendAllLegends();
    expect(short.expectFailure(() => short.playCard(wraith, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("readies another friendly spent unit whose power equals the stolen Gig value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailWraithMarauders, spent: false, hasLag: false },
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: true,
            hasLag: false,
            powerModifier: 2,
          },
          { card: embracingPowerRetailStarterDeckMinotaur, spent: true, hasLag: false },
        ],
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailWraithMarauders, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected chooseTarget choice.");
    const eligible = choice.payload.eligibleIds ?? [];
    expect(eligible).toContain(
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    );
    expect(eligible).not.toContain(
      engine.findCardId(embracingPowerRetailStarterDeckMinotaur, "field", P1),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      false,
    );
    expect(engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P1).meta.spent).toBe(
      true,
    );
  });

  it("excludes itself and rival Units even when their power equals the stolen Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: wraith, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, powerModifier: 1 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, powerModifier: 1 }],
        gigArea: [{ dieType: "d4", faceValue: 4 }],
      },
    );
    engine.attackRival(wraith, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Wraith ready choice.");
    }
    expect(choice.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    ]);
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(choice.payload.eligibleIds).not.toContain(engine.findCardId(wraith, "field", P1));
    expect(choice.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
  });

  it("does not trigger when another friendly Unit steals the Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: wraith, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: true, powerModifier: 0 },
        ],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.spent).toBe(
      true,
    );
  });

  it("continues without a choice when no other friendly Unit matches the stolen value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: wraith, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 5 }] },
    );
    engine.attackRival(wraith, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
  });
});
