// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { bernardBrandNewAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bernard - Brand-New Agent", () => {
//   It.skip("**I’LL CHECK IT OUT** At the end of your turn, if this character is exerted, you may ready another chosen character of yours.", () => {
//     Const testStore = new TestStore({
//       Inkwell: bernardBrandNewAgent.cost,
//       Play: [bernardBrandNewAgent],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BernardBrandNewAgent.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
