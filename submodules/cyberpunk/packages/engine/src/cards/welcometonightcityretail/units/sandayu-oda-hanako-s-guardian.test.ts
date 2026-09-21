import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Sandayu Oda - Hanako's Guardian", () => {
  it("has the exact green Arasaka Merc identity, pair trigger, and Lag exception", () => {
    expect(welcomeToNightCityRetailSandayuOdaHanakoSGuardian).toMatchObject({
      canonicalId: "sandayu-oda-hanako-s-guardian",
      slug: "sandayu-oda-hanako-s-guardian",
      name: "Sandayu Oda",
      displayName: "Sandayu Oda: Hanako's Guardian",
      subname: "Hanako's Guardian",
      type: "unit",
      color: "green",
      classifications: ["Arasaka", "Merc"],
      cost: 7,
      power: 8,
      ram: 2,
      hasSellTag: false,
      rarity: "Rare",
      printNumber: "088",
      timingTriggers: ["play"],
      rulesText:
        "{Play} Spend a rival Unit for each friendly value-pair of Gigs.\nThis Unit can attack rival Units the turn it's played.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "forEachFriendlyGigPair",
              effects: [
                {
                  effect: "spend",
                  target: {
                    selector: "card",
                    controller: "rival",
                    zones: ["field"],
                    cardTypes: ["unit"],
                    state: "ready",
                    selection: { mode: "choose", min: 1, max: 1 },
                  },
                },
              ],
            },
          ],
        },
        {
          kind: "static",
          effects: [
            {
              effect: "grantRule",
              target: { selector: "self" },
              rule: "canAttackOnPlayedTurnAgainstUnits",
              duration: "continuous",
              conditions: [{ condition: "hasLag", target: { selector: "self" } }],
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 7 Eddies and enters with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
      eddies: 7,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, "field", P1).meta.hasLag,
    ).toBe(true);
  });

  it("spends one rival unit for each friendly value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
      },
    );

    expect(
      engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 }),
    ).toMatchObject({
      success: true,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("spends exactly 2 chosen ready rival Units for 2 disjoint value-pairs", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
          { dieType: "d8", faceValue: 5 },
          { dieType: "d10", faceValue: 5 },
          { dieType: "d12", faceValue: 5 },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Sandayu Oda's rival Unit choice.");
    }
    const readyRivalIds = engine
      .getCardsInZone("field", P2)
      .filter((card) => !card.meta.spent)
      .map((card) => card.instanceId);
    const alreadySpentId = engine
      .getCardsInZone("field", P2)
      .find((card) => card.meta.spent)?.instanceId;
    expect(choice.payload).toMatchObject({ min: 2, max: 2, canDecline: false });
    expect(choice.payload.eligibleIds).toHaveLength(2);
    expect(choice.payload.eligibleIds).toEqual(expect.arrayContaining(readyRivalIds));
    expect(choice.payload.eligibleIds).not.toContain(alreadySpentId);

    engine.resolveEffectTargetIds(readyRivalIds, { as: P1 });

    expect(readyRivalIds.every((id) => engine.getState().G.cardIndex[id]?.meta.spent)).toBe(true);
  });

  it("creates no target choice when no friendly Gig values form a pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("can attack rival units the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 });
    const directFailure = engine.expectFailure(() =>
      engine.attackRival(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 }),
    );
    expect(directFailure.errorCode).toBe("LAG");
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    ).toMatchObject({
      success: true,
    });
  });
});
