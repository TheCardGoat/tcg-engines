// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   FalinePlayfulFawn,
//   HiroHamadaIntuitiveThinker,
//   PrinceJohnFraidycat,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Faline - Playful Fawn", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [falinePlayfulFawn],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(falinePlayfulFawn);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("PRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [falinePlayfulFawn],
//       },
//       {
//         Inkwell: princeJohnFraidycat.cost + hiroHamadaIntuitiveThinker.cost,
//         Hand: [princeJohnFraidycat, hiroHamadaIntuitiveThinker],
//       },
//     );
//
//     // Has highest strength
//     Const cardUnderTest = testEngine.getCardModel(falinePlayfulFawn);
//     Expect(cardUnderTest.lore).toEqual(3);
//
//     // Still has highest strength
//     Await testEngine.playCard(hiroHamadaIntuitiveThinker);
//     Expect(cardUnderTest.lore).toEqual(3);
//
//     // Doesn't have highest strength
//     Await testEngine.playCard(princeJohnFraidycat);
//     Expect(cardUnderTest.lore).toEqual(1);
//   });
// });
//
