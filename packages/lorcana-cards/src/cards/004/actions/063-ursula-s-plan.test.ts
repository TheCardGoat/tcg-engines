// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { ursulasPlan } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula's Plan", () => {
//   It.skip("Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: ursulasPlan.cost,
//       Hand: [ursulasPlan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", ursulasPlan.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
