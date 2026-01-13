// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrLitwakArcadeOwner } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mr. Litwak - Arcade Owner", () => {
//   it("THE GANG'S ALL HERE Once during your turn, whenever you play another character, you may ready this character. He can’t quest or challenge for the rest of this turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: deweyLovableShowoff.cost,
//       play: [mrLitwakArcadeOwner],
//       hand: [deweyLovableShowoff],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mrLitwakArcadeOwner);
//     const cardInHand = testEngine.getCardModel(deweyLovableShowoff);
//
//     cardUnderTest.exert();
//
//     expect(cardUnderTest.exerted).toBe(true);
//
//     await testEngine.playCard(cardInHand);
//     await testEngine.acceptOptionalLayer();
//
//     expect(cardUnderTest.exerted).toBe(false);
//   });
// });
//
