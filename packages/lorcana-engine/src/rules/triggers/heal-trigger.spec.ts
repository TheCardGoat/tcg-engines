/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { healingGlow } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import {
  goofyKnightForADay,
  grandPabbieOldestAndWisest,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Heal trigger", () => {
  it("Does not trigger when healing zero damage", () => {
    const testStore = new TestStore({
      play: [grandPabbieOldestAndWisest, goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grandPabbieOldestAndWisest.id,
    );
    const anotherCharacter = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
    );

    expect(testStore.getPlayerLore()).toEqual(0);

    anotherCharacter.updateCardDamage(2, "remove");
    expect(testStore.getPlayerLore()).toEqual(0);
  });

  it("Healing with actions, multiple targets", () => {
    const testStore = new TestStore({
      inkwell: hakunaMatata.cost,
      hand: [hakunaMatata],
      play: [grandPabbieOldestAndWisest, goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grandPabbieOldestAndWisest.id,
    );
    const anotherCharacter = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
    );
    const healCard = testStore.getByZoneAndId("hand", hakunaMatata.id);
    cardUnderTest.updateCardDamage(4);
    anotherCharacter.updateCardDamage(4);

    expect(testStore.getPlayerLore()).toEqual(0);

    healCard.playFromHand();

    expect(testStore.getPlayerLore()).toEqual(4);
  });

  it("Healing with actions, single target", () => {
    const testStore = new TestStore({
      inkwell: healingGlow.cost,
      hand: [healingGlow],
      play: [grandPabbieOldestAndWisest, goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grandPabbieOldestAndWisest.id,
    );
    const healCard = testStore.getByZoneAndId("hand", healingGlow.id);
    cardUnderTest.updateCardDamage(4);

    expect(testStore.getPlayerLore()).toEqual(0);

    healCard.playFromHand();
    testStore.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(testStore.getPlayerLore()).toEqual(2);
  });

  it("Healing with effects", () => {
    const testStore = new TestStore({
      play: [grandPabbieOldestAndWisest, dingleHopper],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grandPabbieOldestAndWisest.id,
    );
    const healCard = testStore.getByZoneAndId("play", dingleHopper.id);
    cardUnderTest.updateCardDamage(4);

    expect(testStore.getPlayerLore()).toEqual(0);

    healCard.activate();
    testStore.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(testStore.getPlayerLore()).toEqual(2);
  });
});
