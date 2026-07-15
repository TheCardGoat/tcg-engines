// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { packTactics } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   GatheringKnowledgeAndWisdom,
//   RememberWhoYouAre,
// } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { tiggerInTheCrowsNest } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tigger - In the Crow’s Nest", () => {
//   It("**SWASH YOUR BUCKLES** Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 90,
//       Play: [tiggerInTheCrowsNest],
//       Hand: [gatheringKnowledgeAndWisdom, rememberWhoYouAre, packTactics],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tiggerInTheCrowsNest);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//     Expect(cardUnderTest.strength).toBe(tiggerInTheCrowsNest.strength);
//     Expect(cardUnderTest.lore).toBe(tiggerInTheCrowsNest.lore);
//
//     Await testEngine.playCard(gatheringKnowledgeAndWisdom);
//     Expect(cardUnderTest.strength).toBe(tiggerInTheCrowsNest.strength + 1);
//     Expect(cardUnderTest.lore).toBe(tiggerInTheCrowsNest.lore + 1);
//
//     Await testEngine.playCard(rememberWhoYouAre);
//     Expect(cardUnderTest.strength).toBe(tiggerInTheCrowsNest.strength + 2);
//     Expect(cardUnderTest.lore).toBe(tiggerInTheCrowsNest.lore + 2);
//
//     Await testEngine.playCard(packTactics);
//     Expect(cardUnderTest.strength).toBe(tiggerInTheCrowsNest.strength + 3);
//     Expect(cardUnderTest.lore).toBe(tiggerInTheCrowsNest.lore + 3);
//   });
// });
//
