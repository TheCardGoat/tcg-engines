// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { chiFuImperialAdvisor } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chi-Fu - Imperial Advisor", () => {
//   It.skip("**OVERLY CAUTIOUS** While this character has no damage, he gets +2 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: chiFuImperialAdvisor.cost,
//       Play: [chiFuImperialAdvisor],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ChiFuImperialAdvisor.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
