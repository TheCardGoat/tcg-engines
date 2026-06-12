import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { zeusMissingHisSpark } from "./193-zeus-missing-his-spark";

const deckCard = createMockCharacter({
  id: "zeus-missing-his-spark-deck-card",
  name: "Deck Card",
  cost: 1,
});

describe("Zeus - Missing His Spark", () => {
  it("has Boost 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [zeusMissingHisSpark],
    });

    expect(testEngine.getCardModel(zeusMissingHisSpark).hasBoost()).toBe(true);
  });

  it("I NEED MORE THUNDERBOLTS! - base stats when no card is under", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [zeusMissingHisSpark],
    });

    expect(testEngine.asPlayerOne().getCardStrength(zeusMissingHisSpark)).toBe(
      zeusMissingHisSpark.strength,
    );
    expect(testEngine.asPlayerOne().getDerivedWillpowerForCard(zeusMissingHisSpark)).toBe(
      zeusMissingHisSpark.willpower,
    );
  });

  it("I NEED MORE THUNDERBOLTS! - gets +2 strength and +2 willpower while there is a card under this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: zeusMissingHisSpark, cardsUnder: [deckCard] }],
    });

    expect(testEngine.asPlayerOne().getCardStrength(zeusMissingHisSpark)).toBe(
      zeusMissingHisSpark.strength + 2,
    );
    expect(testEngine.asPlayerOne().getDerivedWillpowerForCard(zeusMissingHisSpark)).toBe(
      zeusMissingHisSpark.willpower + 2,
    );
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { zeusMissingHisSpark } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Zeus - Missing His Spark", () => {
//   It("Boost 2 (Once during your turn, you may pay 2 to put the top card of your deck facedown under this character.) ", async () => {
//     Const testEngine = new TestEngine({
//       Play: [zeusMissingHisSpark],
//     });
//
//     Expect(testEngine.getCardModel(zeusMissingHisSpark).hasBoost).toBe(true);
//   });
//
//   It("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - with boost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 5,
//       Deck: [moanaOfMotunui],
//       Play: [zeusMissingHisSpark],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Before boost, Zeus should have base stats
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//     Expect(cardUnderTest.cardsUnder).toHaveLength(0);
//
//     // Use boost to put a card under Zeus
//     Await testEngine.activateCard(zeusMissingHisSpark);
//
//     // Verify card was placed under Zeus
//     Expect(cardUnderTest.cardsUnder).toHaveLength(1);
//     Const boostedCard = testEngine.getCardModel(moanaOfMotunui);
//     Expect(boostedCard.isUnder(cardUnderTest)).toBe(true);
//
//     // After boost, Zeus should have +2 strength and +2 willpower
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength + 2);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower + 2);
//   });
//
//   It("I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W} - without boost", async () => {
//     Const testEngine = new TestEngine({
//       Play: [zeusMissingHisSpark],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(zeusMissingHisSpark);
//
//     // Without a card under Zeus, he should have base stats
//     Expect(cardUnderTest.strength).toBe(zeusMissingHisSpark.strength);
//     Expect(cardUnderTest.willpower).toBe(zeusMissingHisSpark.willpower);
//   });
// });
//
