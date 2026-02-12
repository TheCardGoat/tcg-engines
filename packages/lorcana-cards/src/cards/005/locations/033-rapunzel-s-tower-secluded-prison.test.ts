// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rapunzel's Tower - Secluded Prison", () => {
//   It.skip("**SAFE AND SOUND** Characters get +3 {W}️ while here.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rapunzelsTowerSecludedPrison.cost,
//       Play: [rapunzelsTowerSecludedPrison],
//     });
//
//     Const cardUnderTest = testStore.getCard(rapunzelsTowerSecludedPrison);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
