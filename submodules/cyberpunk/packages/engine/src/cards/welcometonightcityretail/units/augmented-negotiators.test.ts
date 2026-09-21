import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAugmentedNegotiators,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

describe("Augmented Negotiators", () => {
  it("is a vanilla-stat yellow Arasaka/Corpo BLOCKER with no Sell Tag", () => {
    expect(welcomeToNightCityRetailAugmentedNegotiators).toMatchObject({
      type: "unit",
      color: "yellow",
      classifications: ["Arasaka", "Corpo"],
      cost: 3,
      power: 2,
      ram: 1,
      hasSellTag: false,
      keywords: ["blocker"],
    });
    expect(welcomeToNightCityRetailAugmentedNegotiators.abilities).toHaveLength(2);
  });

  it("pays 3 to enter with Lag and its printed 2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailAugmentedNegotiators],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailAugmentedNegotiators, { as: P1 });

    const unit = engine.getCard(welcomeToNightCityRetailAugmentedNegotiators, "field", P1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(unit.meta.hasLag).toBe(true);
    expect(getEffectivePower(engine.getState(), unit.instanceId)).toBe(2);
    expect(engine.getPrompt(P1).choice).toBeNull();
  });

  it("uses BLOCKER to redirect a direct attack, then makes the rival discard 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailAugmentedNegotiators, spent: false }],
      },
      {
        hand: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailAugmentedNegotiators, { as: P1 });

    expect(engine.getState().G.attackState?.kind).toBe("fight");
    expect(
      engine.getCard(welcomeToNightCityRetailAugmentedNegotiators, "field", P1).meta.spent,
    ).toBe(true);
    const discardChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(discardChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P2,
      payload: { type: "discardFromHand", amount: 1 },
    });
    if (
      !discardChoice ||
      discardChoice.type !== "chooseTarget" ||
      discardChoice.payload.type !== "discardFromHand"
    ) {
      throw new Error("Expected the attacking Rival to choose exactly one card to discard");
    }
    expect(discardChoice.payload.eligibleIds).toHaveLength(2);

    engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P2 });

    expect(engine.getCardsInZone("hand", P2).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
    ]);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getEvents("blockerActivated")).toEqual([
      expect.objectContaining({
        blockerId: engine.getCard(welcomeToNightCityRetailAugmentedNegotiators, "field", P1)
          .instanceId,
        playerId: P1,
      }),
    ]);
  });

  it("does not trigger when a different friendly Unit uses BLOCKER", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailAugmentedNegotiators, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
        ],
      },
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(1);
    expect(
      engine.getCard(welcomeToNightCityRetailAugmentedNegotiators, "field", P1).meta.spent,
    ).toBe(false);
  });

  it("does not make the Rival discard when it is spent to attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailAugmentedNegotiators,
            spent: false,
            hasLag: false,
          },
        ],
      },
      { hand: [welcomeToNightCityRetailFieldOperator] },
    );

    engine.attackRival(welcomeToNightCityRetailAugmentedNegotiators, { as: P1 });

    expect(engine.getCardsInZone("hand", P2)).toHaveLength(1);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("resolves without a discard choice when the attacking Rival has no cards in hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailAugmentedNegotiators, spent: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailAugmentedNegotiators, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(0);
  });
});
