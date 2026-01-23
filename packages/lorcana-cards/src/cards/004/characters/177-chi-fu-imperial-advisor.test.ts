// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { chiFuImperialAdvisor } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Chi-Fu - Imperial Advisor", () => {
//   it.skip("**OVERLY CAUTIOUS** While this character has no damage, he gets +2 {L}.", () => {
//     const testStore = new TestStore({
//       inkwell: chiFuImperialAdvisor.cost,
//       play: [chiFuImperialAdvisor],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       chiFuImperialAdvisor.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
