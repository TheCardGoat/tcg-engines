// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { theMagicFeather } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Magic Feather", () => {
//   It("NOW YOU CAN FLY! When you play this item, choose a character of yours. While this item is in play, that character gains Evasive. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theMagicFeather.cost,
//       Play: [deweyLovableShowoff],
//       Hand: [theMagicFeather],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theMagicFeather);
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.hasEvasive).toBe(true);
//   });
//
//   It("GROUNDED 3 {I} – Return this item to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 3,
//       Play: [theMagicFeather],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theMagicFeather);
//
//     Expect(cardUnderTest.zone).toBe("play");
//
//     TestEngine.activateCard(cardUnderTest);
//
//     Expect(cardUnderTest.zone).toBe("hand");
//   });
//
//   It("Character loses Evasive when the item leaves play", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theMagicFeather.cost + 3,
//       Play: [deweyLovableShowoff],
//       Hand: [theMagicFeather],
//     });
//
//     Const itemCard = testEngine.getCardModel(theMagicFeather);
//     Const characterCard = testEngine.getCardModel(deweyLovableShowoff);
//
//     // Play the item and choose the character
//     Await testEngine.playCard(itemCard);
//     Await testEngine.resolveTopOfStack({ targets: [characterCard] });
//
//     // Verify character has Evasive
//     Expect(characterCard.hasEvasive).toBe(true);
//
//     // Use GROUNDED ability to return the item to hand
//     TestEngine.activateCard(itemCard);
//
//     // Verify character lost Evasive when item left play
//     Expect(characterCard.hasEvasive).toBe(false);
//   });
// });
//
