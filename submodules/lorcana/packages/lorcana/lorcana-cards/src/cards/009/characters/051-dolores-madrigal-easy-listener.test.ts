// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { doloresMadrigalEasyListener } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dolores Madrigal - Easy Listener", () => {
//   It.skip("**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: doloresMadrigalEasyListener.cost,
//       Hand: [doloresMadrigalEasyListener],
//     });
//
//     Await testEngine.playCard(doloresMadrigalEasyListener);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
