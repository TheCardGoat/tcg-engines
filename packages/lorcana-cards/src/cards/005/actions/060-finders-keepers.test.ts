// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { findersKeepers } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Finders Keepers", () => {
//   It("Draw 3 cards.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: findersKeepers.cost,
//       Hand: [findersKeepers],
//       Deck: [goonsMaleficent, goonsMaleficent, goonsMaleficent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(findersKeepers);
//     CardUnderTest.playFromHand();
//     Expect(testEngine.getZonesCardCount().hand).toBe(3);
//   });
// });
//
