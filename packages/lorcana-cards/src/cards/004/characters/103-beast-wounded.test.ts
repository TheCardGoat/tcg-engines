// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { beastWounded } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast - Wounded", () => {
//   It("**THAT HURTS!** This character enters play with 4 damage.", () => {
//     Const testStore = new TestStore({
//       Inkwell: beastWounded.cost,
//       Hand: [beastWounded],
//     });
//
//     Const cardUnderTest = testStore.getCard(beastWounded);
//
//     CardUnderTest.playFromHand();
//     Expect(cardUnderTest.damage).toEqual(4);
//   });
// });
//
