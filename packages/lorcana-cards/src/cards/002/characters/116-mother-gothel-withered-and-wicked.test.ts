// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { motherGothelWitheredAndWicked } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mother Gothel - Withered and Wicked", () => {
//   It("**WHAT HAVE YOU DONE?!** This character enters play with 3 damage.", () => {
//     Const testStore = new TestStore({
//       Inkwell: motherGothelWitheredAndWicked.cost,
//       Hand: [motherGothelWitheredAndWicked],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MotherGothelWitheredAndWicked.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.damage).toEqual(3);
//   });
// });
//
