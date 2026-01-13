// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { doloresMadrigalEasyListener } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dolores Madrigal - Easy Listener", () => {
//   it.skip("**MAGICAL INFORMANT** When you play this character, if an opponent has an exerted character in play, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: doloresMadrigalEasyListener.cost,
//       hand: [doloresMadrigalEasyListener],
//     });
//
//     await testEngine.playCard(doloresMadrigalEasyListener);
//     await testEngine.acceptOptionalLayer();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
