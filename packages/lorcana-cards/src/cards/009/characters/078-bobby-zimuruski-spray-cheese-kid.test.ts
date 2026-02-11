// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { bobbyZimuruskiSprayCheeseKid } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bobby Zimuruski - Spray Cheese Kid", () => {
//   It.skip("SO CHEESY When you play this character, you may draw a card, then choose and discard a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bobbyZimuruskiSprayCheeseKid.cost,
//       Hand: [bobbyZimuruskiSprayCheeseKid],
//     });
//
//     Await testEngine.playCard(bobbyZimuruskiSprayCheeseKid);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
