// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { bobbyZimuruskiSprayCheeseKid } from "@lorcanito/lorcana-engine/cards/009";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Bobby Zimuruski - Spray Cheese Kid", () => {
//   it.skip("SO CHEESY When you play this character, you may draw a card, then choose and discard a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: bobbyZimuruskiSprayCheeseKid.cost,
//       hand: [bobbyZimuruskiSprayCheeseKid],
//     });
//
//     await testEngine.playCard(bobbyZimuruskiSprayCheeseKid);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
