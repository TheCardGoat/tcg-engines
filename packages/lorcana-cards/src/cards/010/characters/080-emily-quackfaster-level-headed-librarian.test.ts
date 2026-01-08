// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/180-goofy-knight-for-a-day";
// import {
//   emilyQuackfasterLevelheadedLibrarian,
//   littleJohnImpermanentOutlaw,
//   simbaKingInTheMaking,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Emily Quackfaster - Level-Headed Librarian", () => {
//   describe("RECOMMENDED READING - When you play this character, you may put the top card of your deck facedown under one of your characters or locations with Boost.", () => {
//     it("should allow putting top card of deck under a character with Boost when played", async () => {
//       const testEngine = new TestEngine({
//         inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         deck: 5,
//         play: [simbaKingInTheMaking], // Has Boost 3 ability
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         emilyQuackfasterLevelheadedLibrarian,
//       );
//       const boostCharacter = testEngine.getCardModel(simbaKingInTheMaking);
//
//       // Initially, Simba should have no cards under him
//       expect(boostCharacter.cardsUnder.length).toBe(0);
//
//       // Play Emily Quackfaster
//       await testEngine.playCard(cardUnderTest);
//
//       // Accept the optional trigger
//       await testEngine.acceptOptionalLayer();
//
//       // Select Simba as the target to put the card under
//       await testEngine.resolveTopOfStack({ targets: [boostCharacter] }, true);
//
//       // Skip Simba's TIMELY ALLIANCE trigger (it tries to trigger when a card is put under him)
//       await testEngine.skipTopOfStack();
//
//       // Verify card was put under Simba
//       expect(boostCharacter.cardsUnder.length).toBe(1);
//     });
//
//     it("should be optional - can decline the trigger", async () => {
//       const testEngine = new TestEngine({
//         inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         deck: 5,
//         play: [simbaKingInTheMaking],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         emilyQuackfasterLevelheadedLibrarian,
//       );
//       const boostCharacter = testEngine.getCardModel(simbaKingInTheMaking);
//
//       expect(boostCharacter.cardsUnder.length).toBe(0);
//
//       // Play Emily Quackfaster
//       await testEngine.playCard(cardUnderTest);
//
//       // Decline the optional trigger
//       await testEngine.skipTopOfStack();
//
//       // No card should be put under Simba
//       expect(boostCharacter.cardsUnder.length).toBe(0);
//     });
//
//     it("should NOT trigger if there are no characters or locations with Boost in play", async () => {
//       const testEngine = new TestEngine({
//         inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         deck: 5,
//         play: [], // No characters with Boost
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         emilyQuackfasterLevelheadedLibrarian,
//       );
//
//       // Play Emily Quackfaster
//       await testEngine.playCard(cardUnderTest);
//
//       // Should be able to accept optional without targets (no valid targets available)
//       await testEngine.acceptOptionalLayer();
//
//       // Verify Emily is in play
//       expect(cardUnderTest.zone).toBe("play");
//     });
//
//     it("declining the optional ability leaves deck unchanged", async () => {
//       const testEngine = new TestEngine({
//         inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         deck: [goofyKnightForADay],
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         play: [littleJohnImpermanentOutlaw],
//       });
//
//       // Play Emily and then skip the optional layer (decline)
//       await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//       await testEngine.skipTopOfStack();
//
//       // Deck should remain intact and nothing put under target
//       expect(testEngine.getZonesCardCount().deck).toBe(1);
//       const target = testEngine.getCardModel(littleJohnImpermanentOutlaw);
//       expect(target.cardsUnder).toHaveLength(0);
//     });
//
//     it("when no valid Boost targets exist nothing happens", async () => {
//       const testEngine = new TestEngine({
//         inkwell: emilyQuackfasterLevelheadedLibrarian.cost,
//         deck: [littleJohnImpermanentOutlaw],
//         hand: [emilyQuackfasterLevelheadedLibrarian],
//         play: [goofyKnightForADay],
//       });
//
//       // Play Emily; there are no booster targets in play so nothing should be put under any card
//       await testEngine.playCard(emilyQuackfasterLevelheadedLibrarian);
//
//       // NOTE: it appears that the optional layer needs to be accepted by tests,
//       //       but may not occur in the UI.
//       await testEngine.acceptOptionalLayer();
//
//       // Verify that the stack is now empty (no target selection)
//       expect(testEngine.stackLayers).toHaveLength(0);
//
//       expect(testEngine.getZonesCardCount().deck).toBe(1);
//       expect(testEngine.getZonesCardCount().play).toBe(2);
//     });
//   });
// });
//
