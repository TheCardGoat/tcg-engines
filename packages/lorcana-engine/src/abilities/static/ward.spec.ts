import { describe, expect, it } from "@jest/globals";
import {
  donaldDuckStruttingHisStuff,
  liloMakingAWish,
  simbaFutureKing,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { plasmaBlaster } from "@lorcanito/lorcana-engine/cards/001/items/items";
import {
  grabYourSword,
  partOfOurWorld,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
import {
  goofyKnightForADay,
  peteBadGuy,
  theNokkWaterSpirit,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
/**
 * @jest-environment node
 */
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Ward keyword", () => {
  it("Effects that don't require a target can affect characters with ward", () => {
    const testStore = new TestStore({
      inkwell: fourDozenEggs.cost,
      hand: [fourDozenEggs],
      play: [theNokkWaterSpirit, peteBadGuy],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", fourDozenEggs.id);
    const target = testStore.getByZoneAndId("play", peteBadGuy.id);
    const anotherTarget = testStore.getByZoneAndId(
      "play",
      theNokkWaterSpirit.id,
    );

    cardUnderTest.playFromHand();

    for (const character of [target, anotherTarget]) {
      expect(character.hasResist).toBe(true);
    }
  });

  it("should be able to target from hand", () => {
    const testStore = new TestStore({
      inkwell: simbaFutureKing.cost,
      hand: [theNokkWaterSpirit, simbaFutureKing],
      deck: 1,
    });

    const action = testStore.getByZoneAndId("hand", simbaFutureKing.id);
    const targetWithWard = testStore.getByZoneAndId(
      "hand",
      theNokkWaterSpirit.id,
    );

    action.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [targetWithWard] });

    expect(targetWithWard.zone).toEqual("discard");
  });

  it("should be able to target from discard", () => {
    const testStore = new TestStore({
      inkwell: partOfOurWorld.cost,
      hand: [partOfOurWorld],
      discard: [peteBadGuy],
    });

    const action = testStore.getByZoneAndId("hand", partOfOurWorld.id);
    const targetWithWard = testStore.getByZoneAndId("discard", peteBadGuy.id);

    action.playFromHand();
    testStore.resolveTopOfStack({ targets: [targetWithWard] });

    expect(targetWithWard.zone).toEqual("hand");
    expect(action.zone).toEqual("discard");
  });

  it("Cannot target characters in play that has ward", () => {
    const testStore = new TestStore(
      {
        play: [plasmaBlaster],
        inkwell: 2,
      },
      {
        play: [donaldDuckStruttingHisStuff, liloMakingAWish],
      },
    );

    const blaster = testStore.getByZoneAndId("play", plasmaBlaster.id);
    const cardUnderTest = testStore.getCard(donaldDuckStruttingHisStuff);

    blaster.activate();

    testStore.resolveTopOfStack({ targets: [cardUnderTest] }, true);
    expect(cardUnderTest.meta.damage).toBeFalsy();

    // Effect doesn't resolve, letting the opponent to choose another target
    expect(testStore.stackLayers).toHaveLength(1);
  });

  it("When non valid target is present, effect is skipped", () => {
    const testStore = new TestStore(
      {
        play: [plasmaBlaster],
        inkwell: plasmaBlaster.cost,
      },
      {
        play: [donaldDuckStruttingHisStuff],
      },
    );

    const blaster = testStore.getByZoneAndId("play", plasmaBlaster.id);
    const cardUnderTest = testStore.getCard(donaldDuckStruttingHisStuff);

    blaster.activate();

    expect(testStore.stackLayers).toHaveLength(0);
    expect(cardUnderTest.meta.damage).toBeFalsy();
  });

  it("should be able to target if the effect targets all", () => {
    const opponentCards = [
      donaldDuckStruttingHisStuff,
      peteBadGuy,
      goofyKnightForADay,
    ];
    const testStore = new TestStore(
      {
        hand: [grabYourSword],
        inkwell: grabYourSword.cost,
      },
      {
        play: opponentCards,
      },
    );

    const removal = testStore.getCard(grabYourSword);
    removal.playFromHand();

    expect(testStore.stackLayers).toHaveLength(0);
    for (const card of opponentCards) {
      expect(testStore.getCard(card).damage).toEqual(2);
    }
  });
});
