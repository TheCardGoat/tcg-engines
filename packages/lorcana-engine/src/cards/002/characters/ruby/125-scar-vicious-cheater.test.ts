/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  pinocchioStarAttraction,
  pinocchioTalkativePuppet,
  scarViciousCheater,
  theHuntsmanReluctantEnforcer,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Scar - Vicious Cheater", () => {
  it("Rush", () => {
    const testStore = new TestStore({
      play: [scarViciousCheater],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      scarViciousCheater.id,
    );

    expect(cardUnderTest.hasRush).toBe(true);
  });

  it("**DADDY ISN’T HERE TO SAVE YOU** During your turn, whenever this character banishes another character in a challenge, you may ready this character. He can't quest for the rest of this turn.", () => {
    const testStore = new TestStore(
      {
        play: [scarViciousCheater],
      },
      {
        play: [
          theHuntsmanReluctantEnforcer,
          pinocchioTalkativePuppet,
          pinocchioStarAttraction,
        ],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      scarViciousCheater.id,
    );

    const target = testStore.getByZoneAndId(
      "play",
      theHuntsmanReluctantEnforcer.id,
      "player_two",
    );
    const target2 = testStore.getByZoneAndId(
      "play",
      pinocchioTalkativePuppet.id,
      "player_two",
    );
    const target3 = testStore.getByZoneAndId(
      "play",
      pinocchioStarAttraction.id,
      "player_two",
    );

    [target, target2, target3].forEach((char) => {
      char.updateCardMeta({ exerted: true });
      cardUnderTest.challenge(char);

      expect(char.zone).toBe("discard");
      expect(cardUnderTest.ready).toBe(true);
    });

    expect(cardUnderTest.hasQuestRestriction).toBe(true);
    expect(cardUnderTest.damage).toBe(
      target.strength + target2.strength + target3.strength,
    );
  });
});

describe("Regression Test", () => {
  const testStore = new TestStore(
    {
      play: [scarViciousCheater],
    },
    {
      play: [hiddenCoveTranquilHaven],
    },
  );

  const cardUnderTest = testStore.getCard(scarViciousCheater);
  const target = testStore.getCard(hiddenCoveTranquilHaven);

  target.updateCardMeta({
    exerted: true,
    damage: hiddenCoveTranquilHaven.willpower - 1,
  });

  cardUnderTest.challenge(target);

  expect(target.zone).toBe("discard");
  expect(cardUnderTest.ready).toBe(false);
  expect(cardUnderTest.hasQuestRestriction).toBe(false);
});
