import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaFutureKing } from "./188-simba-future-king";

const drawnCard = createMockCharacter({
  id: "simba-future-king-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "simba-future-king-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Simba - Future King", () => {
  describe("GUESS WHAT? - When you play this character, you may draw a card, then choose and discard a card.", () => {
    it("draws a card then discards a chosen card when optional ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: simbaFutureKing.cost,
        deck: [drawnCard],
        hand: [simbaFutureKing, discardFodder],
      });

      const simbaId = testEngine.findCardInstanceId(simbaFutureKing, "hand");

      testEngine.asPlayerOne().playCard(simbaId);

      // There should be one optional ability in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional ability (draw a card)
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaFutureKing, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // After drawing, hand should have discardFodder + drawnCard = 2 cards
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 0,
        hand: 2,
        play: 1,
      });

      // Now must discard a card
      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodderId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 1,
        hand: 1,
        play: 1,
      });
    });
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MagicBroomBucketBrigade,
//   SimbaFutureKing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Future King", () => {
//   Describe("**GUESS WHAT?** When you play this character, you may draw a card, then choose and discard a card.", () => {
//     It("Happy path", () => {
//       Const testStore = new TestStore({
//         Inkwell: simbaFutureKing.cost,
//         Deck: [magicBroomBucketBrigade],
//         Hand: [simbaFutureKing],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         SimbaFutureKing.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//       TestStore.resolveOptionalAbility();
//
//       Expect(testStore.stackLayers).toHaveLength(1);
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
//       );
//
//       Const aCardToDiscard = testStore.getByZoneAndId(
//         "hand",
//         MagicBroomBucketBrigade.id,
//       );
//       TestStore.resolveTopOfStack({
//         Targets: [aCardToDiscard],
//       });
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
//       );
//     });
//
//     // it.todo("should not let people skip the discard");
//   });
// });
//
