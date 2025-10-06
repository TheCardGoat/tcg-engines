/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  rapunzelGiftedArtist,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { maleficentMistressOfEvil } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rapunzel - Gifted Artist", () => {
  it("**LET YOUR POWER SHINE** Whenever you remove 1 or more damage from one of your characters, you may draw a card.", () => {
    const testStore = new TestStore({
      play: [rapunzelGiftedArtist, goofyKnightForADay],
      deck: 5,
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rapunzelGiftedArtist.id,
    );
    const anotherCharacter = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
    );

    cardUnderTest.updateCardDamage(4);
    anotherCharacter.updateCardDamage(4);

    cardUnderTest.updateCardDamage(2, "remove");
    testStore.resolveOptionalAbility();
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 4,
        hand: 1,
      }),
    );

    anotherCharacter.updateCardDamage(2, "remove");
    testStore.resolveOptionalAbility();
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 3,
        hand: 2,
      }),
    );
  });

  it("Shift", () => {
    const testStore = new TestStore({
      play: [rapunzelGiftedArtist],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rapunzelGiftedArtist.id,
    );

    expect(cardUnderTest.hasShift).toEqual(true);
  });
});

describe("Regression", () => {
  it("Rapunzel, Maleficent COMBO WOMBO", async () => {
    const testEngine = new TestEngine(
      {
        play: [rapunzelGiftedArtist, maleficentMistressOfEvil],
        deck: 20,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const target = testEngine.getCardModel(goofyKnightForADay);
    const rapunzel = await testEngine.setCardDamage(
      rapunzelGiftedArtist,
      rapunzelGiftedArtist.willpower - 1,
    );
    const maleficent = await testEngine.setCardDamage(
      maleficentMistressOfEvil,
      maleficentMistressOfEvil.willpower - 1,
    );

    // Questing with Maleficent will draw you a card
    await testEngine.questCard(maleficent);
    await testEngine.resolveOptionalAbility();
    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({ deck: 19, hand: 1 }),
    );

    // COMBO STARTS - Moving all damage from Maleficent to Goofy
    for (let i = 2; i < 4; i++) {
      // Drawing a card, will let you move damage
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [maleficent] }, true);
      await testEngine.resolveTopOfStack(
        { targets: [goofyKnightForADay] },
        true,
      );
      expect(maleficent.damage).toEqual(maleficentMistressOfEvil.willpower - i);
      expect(target.damage).toEqual(i - 1);

      // Moving damage will let you draw a card from Rapunzel
      await testEngine.resolveOptionalAbility();
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 20 - i, hand: i }),
      );
    }

    // COMBO Continues - Moving all damage from Rapunzel to Goofy
    for (let i = 2; i < 7; i++) {
      // Drawing a card, will let you move damage
      await testEngine.resolveOptionalAbility();
      await testEngine.resolveTopOfStack({ targets: [rapunzel] }, true);
      await testEngine.resolveTopOfStack(
        { targets: [goofyKnightForADay] },
        true,
      );
      expect(rapunzel.damage).toEqual(rapunzel.willpower - i);
      expect(target.damage).toEqual(i + 1);

      // Moving damage will let you draw a card from Rapunzel
      await testEngine.resolveOptionalAbility();
      expect(testEngine.getZonesCardCount()).toEqual(
        expect.objectContaining({ deck: 18 - i, hand: 2 + i }),
      );
    }

    const totalDamageMoved =
      maleficentMistressOfEvil.willpower -
      1 +
      rapunzelGiftedArtist.willpower -
      1;
    expect(rapunzel.damage).toEqual(0);
    expect(maleficent.damage).toEqual(0);
    expect(target.damage).toEqual(totalDamageMoved);

    expect(testEngine.getZonesCardCount()).toEqual(
      expect.objectContaining({
        deck: 20 - totalDamageMoved - 1,
        hand: totalDamageMoved + 1,
      }),
    );
  });
});
