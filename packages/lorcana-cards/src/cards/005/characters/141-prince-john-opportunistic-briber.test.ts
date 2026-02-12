// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { princeJohnOpportunisticBriber } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince John - Opportunistic Briber", () => {
//   It("**TAXES NEVER FAIL ME** Whenever you play an item, this character gets +2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: pawpsicle.cost,
//       Hand: [pawpsicle],
//       Play: [princeJohnOpportunisticBriber],
//     });
//
//     Const cardUnderTest = testStore.getCard(princeJohnOpportunisticBriber);
//     Const trigger = testStore.getCard(pawpsicle);
//
//     Expect(cardUnderTest.strength).toBe(princeJohnOpportunisticBriber.strength);
//
//     Trigger.playFromHand();
//     TestStore.resolveOptionalAbility();
//
//     Expect(cardUnderTest.strength).toBe(
//       PrinceJohnOpportunisticBriber.strength + 2,
//     );
//   });
// });
//
