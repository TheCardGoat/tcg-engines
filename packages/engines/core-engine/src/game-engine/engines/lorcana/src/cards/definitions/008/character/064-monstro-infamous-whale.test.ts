/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
// Legacy import removed - types available via local definitions
import type { GenerateOnDemandLayerMove } from "@lorcanito/shared";
import { weKnowTheWay } from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";
import { alanadaleRockinRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  deweyLovableShowoff,
  donaldDuckCoinCollector,
  monstroInfamousWhale,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { moneyEverywhere } from "./037-donaldDuckCoinCollector";
import {
  fullBreach,
  fullBreachAndMoneyEverywhereCombo,
} from "./064-monstro-infamous-whale";

describe("Monstro - Infamous Whale", () => {
  it("Rush (This character can challenge the turn they're played.)", async () => {
    const testEngine = new TestEngine({
      play: [monstroInfamousWhale],
    });

    const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("FULL BREACH Choose and discard a card – Ready this character. He can't quest for the rest of this turn.", async () => {
    const testEngine = new TestEngine({
      play: [monstroInfamousWhale],
      hand: [deweyLovableShowoff],
    });

    const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
    const target = testEngine.getCardModel(deweyLovableShowoff);

    cardUnderTest.exert();
    expect(cardUnderTest.exerted).toEqual(true);

    cardUnderTest.activate("FULL BREACH", { costs: [target] });

    expect(cardUnderTest.exerted).toEqual(false);
  });
});

describe("Infinite Loop", () => {
  // Note this is a work-around, so don't this as example
  it("Adds a helper function to RootStore", async () => {
    const testEngine = new TestEngine({
      play: [monstroInfamousWhale],
      hand: [donaldDuckCoinCollector, alanadaleRockinRooster, weKnowTheWay],
      deck: 60,
    });

    testEngine.assertThatZonesContain({
      hand: 3,
      deck: 60,
      discard: 0,
    });

    const move: GenerateOnDemandLayerMove = {
      type: "GENERATE_ON_DEMAND_LAYER",
      instanceId: testEngine.getCardModel(monstroInfamousWhale).instanceId,
      ability: fullBreachAndMoneyEverywhereCombo as unknown as Record<
        string,
        unknown
      >,
    };
    await testEngine.engine.execute(move);

    testEngine.assertThatZonesContain({
      hand: 63,
      deck: 0,
      discard: 0,
    });

    expect(testEngine.stackLayers).toHaveLength(1);

    const hand = testEngine.store.tableStore.getPlayerZone(
      "player_one",
      "hand",
    ).cards;
    const targets = hand.slice(0, 60);

    await testEngine.resolveTopOfStack({
      targets,
    });

    testEngine.assertThatZonesContain({
      hand: 3,
      deck: 0,
      discard: 60,
    });

    expect(testEngine.stackLayers).toHaveLength(0);
  });

  it("Should not create infinite continuous effects, or else it breaks the transport mechanism", async () => {
    const testEngine = new TestEngine({
      inkwell: donaldDuckCoinCollector.cost,
      play: [monstroInfamousWhale],
      hand: [donaldDuckCoinCollector],
      deck: 60,
    });

    const cardUnderTest = testEngine.getCardModel(monstroInfamousWhale);
    expect(cardUnderTest.activatedAbilities).toHaveLength(1);
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(0);

    await testEngine.playCard(donaldDuckCoinCollector);

    expect(cardUnderTest.activatedAbilities).toHaveLength(2);
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(2); // Donald and Monstro are both with Donald's continuous effect

    testEngine.assertThatZonesContain({
      deck: 60,
      hand: 0,
    });

    await testEngine.activateCard(cardUnderTest, {
      ability: moneyEverywhere.name,
    });

    testEngine.assertThatZonesContain({
      deck: 59,
      hand: 1,
      discard: 0,
    });

    await testEngine.activateCard(cardUnderTest, {
      ability: fullBreach.name,
      costs: [testEngine.getACardFromHand()],
    });

    testEngine.assertThatZonesContain({
      deck: 59,
      hand: 0,
      discard: 1,
    });

    // Once Monstro Discards, he will untap and can't quest until the end of the turn.
    expect(cardUnderTest.exerted).toEqual(false);
    expect(cardUnderTest.hasQuestRestriction).toEqual(true);
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(3); // Added Monstro's continuous effect, as he can't quest for the rest of the turn.

    // Now if we repeat this indefinitely, we don't want to have infinite continuous effects.

    await testEngine.activateCard(cardUnderTest, {
      ability: moneyEverywhere.name,
    });
    await testEngine.activateCard(cardUnderTest, {
      ability: fullBreach.name,
      costs: [testEngine.getACardFromHand()],
    });

    expect(cardUnderTest.hasQuestRestriction).toEqual(true);
    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(3); // instead of adding another continuous effect, we should skip adding the same one again.

    // Doing one more time to ensure it works consistently
    await testEngine.activateCard(cardUnderTest, {
      ability: moneyEverywhere.name,
    });
    await testEngine.activateCard(cardUnderTest, {
      ability: fullBreach.name,
      costs: [testEngine.getACardFromHand()],
    });

    expect(
      testEngine.store.continuousEffectStore.continuousEffects,
    ).toHaveLength(3);
  });
});
