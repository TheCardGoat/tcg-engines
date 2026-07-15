// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BernardOverprepared,
//   JimDearBelovedHusband,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bernard - Over-Prepared", () => {
//   It("GO DOWN THERE AND INVESTIGATE When you play this character, if you have an Ally character in play, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: bernardOverprepared.cost + jimDearBelovedHusband.cost,
//       Hand: [bernardOverprepared],
//       Play: [jimDearBelovedHusband],
//       Deck: 1,
//     });
//
//     Const initialHandCount = testEngine.getZonesCardCount().hand;
//     Expect(initialHandCount).toBe(1);
//
//     Await testEngine.playCard(bernardOverprepared);
//     Expect(testEngine.getZonesCardCount().hand).toBe(0);
//
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getZonesCardCount().hand).toBe(1);
//     Expect(testEngine.getZonesCardCount().deck).toBe(0);
//   });
// });
//
