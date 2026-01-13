// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { genieSupportiveFriend } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
//
// describe("Genie - Supportive Friend", () => {
//   // Flaky test - skipping for now
//   it.skip("**THREE WISHES** Whenever this character quests, you may shuffle this card into your deck to draw 3 cards.", async () => {
//     const testEngine = new TestEngine({
//       play: [genieSupportiveFriend],
//       deck: 4,
//     });
//
//     await testEngine.questCard(genieSupportiveFriend);
//
//     // Accept and resolve the optional ability
//     await testEngine.resolveOptionalAbility();
//
//     const zoneCount = testEngine.getZonesCardCount();
//
//     // Check to make sure that the genie has been shuffled into the deck
//     expect(zoneCount.deck).toEqual(2);
//
//     // Check to make sure that 3 cards have been drawn
//     expect(zoneCount.hand).toEqual(3);
//
//     // Check to make sure that there are no cards left in play
//     expect(zoneCount.play).toEqual(0);
//   });
// });
//
