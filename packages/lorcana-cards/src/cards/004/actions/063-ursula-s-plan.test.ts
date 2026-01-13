// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { ursulasPlan } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ursula's Plan", () => {
//   it.skip("Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.", () => {
//     const testStore = new TestStore({
//       inkwell: ursulasPlan.cost,
//       hand: [ursulasPlan],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", ursulasPlan.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
