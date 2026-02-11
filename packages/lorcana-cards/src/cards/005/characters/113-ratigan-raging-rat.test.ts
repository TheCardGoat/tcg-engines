// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ratiganRagingRat } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ratigan - Raging Rat", () => {
//   Describe("**NOTHING CAN STAND IN MY WAY** While this character has damage, he gets +2 {S}.", () => {
//     It("should get +2 {S} while having damage", () => {
//       Const testStore = new TestStore({
//         Play: [ratiganRagingRat],
//       });
//
//       Const cardUnderTest = testStore.getCard(ratiganRagingRat);
//
//       Expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength);
//
//       CardUnderTest.updateCardDamage(1, "add");
//
//       Expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength + 2);
//
//       CardUnderTest.updateCardDamage(1, "remove");
//
//       Expect(cardUnderTest.strength).toBe(ratiganRagingRat.strength);
//     });
//   });
// });
//
