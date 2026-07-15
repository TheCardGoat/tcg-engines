// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// Import {
//   EmilyQuackfasterLevelheadedLibrarian,
//   LittleJohnImpermanentOutlaw,
//   SimbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Emily Quackfaster - Level-Headed Librarian", () => {
//   Describe("RECOMMENDED READING - When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.", () => {
//     It("should allow putting top card of deck under a character with Boost when played", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Deck: 5,
//         Play: [simbaKingInTheMaking], // Has Boost 3 ability
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         EmilyQuackfasterLevelheadedLibrarian,
//       );
//       Const boostCharacter = testEngine.getCardModel(simbaKingInTheMaking);
//
//       // Initially, Simba should have no cards under him
//       Expect(boostCharacter.cardsUnder.length).toBe(0);
//
//       // Play Emily Quackfaster
//       Await testEngine.playCard(cardUnderTest);
//
//       // Accept the optional trigger
//       Await testEngine.acceptOptionalLayer();
//
//       // Select Simba as the target to put the card under
//       Await testEngine.resolveTopOfStack({ targets: [boostCharacter] }, true);
//
//       // Skip Simba's TIMELY ALLIANCE trigger (it tries to trigger when a card is put under him)
//       Await testEngine.skipTopOfStack();
//
//       // Verify card was put under Simba
//       Expect(boostCharacter.cardsUnder.length).toBe(1);
//     });
//
//     It("should be optional - can decline the trigger", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Deck: 5,
//         Play: [simbaKingInTheMaking],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         EmilyQuackfasterLevelheadedLibrarian,
//       );
//       Const boostCharacter = testEngine.getCardModel(simbaKingInTheMaking);
//
//       Expect(boostCharacter.cardsUnder.length).toBe(0);
//
//       // Play Emily Quackfaster
//       Await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional trigger
//       Await testEngine.skipTopOfStack();
//
//       // No card should be put under Simba
//       Expect(boostCharacter.cardsUnder.length).toBe(0);
//     });
//
//     It("should NOT trigger if there are no characters or locations with Boost in play", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Deck: 5,
//         Play: [], // No characters with Boost
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         EmilyQuackfasterLevelheadedLibrarian,
//       );
//
//       // Play Emily Quackfaster
//       Await testEngine.playCard(cardUnderTest);
//
//       // Should be able to accept optional without targets (no valid targets available)
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify Emily is in play
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("declining the optional ability leaves deck unchanged", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         Deck: [goofyKnightForADay],
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Play: [littleJohnImpermanentOutlaw],
//       });
//
//       // Play Emily and then skip the optional layer (decline)
//       Await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//       Await testEngine.skipTopOfStack();
//
//       // Deck should remain intact and nothing put under target
//       Expect(testEngine.getZonesCardCount().deck).toBe(1);
//       Const target = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//       Expect(target.cardsUnder).toHaveLength(0);
//     });
//
//     It("when no valid Boost targets exist nothing happens", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         Deck: [littleJohnImpermanentOutlaw],
//         Hand: [emilyQuackfasterLevelheadedLibrarian],
//         Play: [goofyKnightForADay],
//       });
//
//       // Play Emily; there are no booster targets in play so nothing should be put under any card
//       Await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//
//       // NOTE: it appears that the optional layer needs to be accepted by tests,
//       //       but may not occur in the UI.
//       Await testEngine.acceptOptionalLayer();
//
//       // Verify that the stack is now empty (no target selection)
//       Expect(testEngine.stackLayers).toHaveLength(0);
//
//       Expect(testEngine.getZonesCardCount().deck).toBe(1);
//       Expect(testEngine.getZonesCardCount().play).toBe(2);
//     });
//   });
// });
//
