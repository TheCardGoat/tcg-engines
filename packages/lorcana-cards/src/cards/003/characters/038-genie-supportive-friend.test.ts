// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { genieSupportiveFriend } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
//
// Describe("Genie - Supportive Friend", () => {
//   // Flaky test - skipping for now
//   It.skip("**THREE WISHES** Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [genieSupportiveFriend],
//       Deck: 4,
//     });
//
//     Await testEngine.questCard(genieSupportiveFriend);
//
//     // Accept and resolve the optional ability
//     Await testEngine.resolveOptionalAbility();
//
//     Const zoneCount = testEngine.getZonesCardCount();
//
//     // Check to make sure that the genie has been shuffled into the deck
//     Expect(zoneCount.deck).toEqual(2);
//
//     // Check to make sure that 3 cards have been drawn
//     Expect(zoneCount.hand).toEqual(3);
//
//     // Check to make sure that there are no cards left in play
//     Expect(zoneCount.play).toEqual(0);
//   });
// });
//
