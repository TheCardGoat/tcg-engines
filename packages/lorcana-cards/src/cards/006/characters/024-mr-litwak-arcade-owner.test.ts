// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrLitwakArcadeOwner } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mr. Litwak - Arcade Owner", () => {
//   It("THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: deweyLovableShowoff.cost,
//       Play: [mrLitwakArcadeOwner],
//       Hand: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mrLitwakArcadeOwner);
//     Const cardInHand = testEngine.getCardModel(deweyLovableShowoff);
//
//     CardUnderTest.exert();
//
//     Expect(cardUnderTest.exerted).toBe(true);
//
//     Await testEngine.playCard(cardInHand);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(cardUnderTest.exerted).toBe(false);
//   });
// });
//
