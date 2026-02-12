// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { flotsamAndJetsamEntanglingEels } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flotsam & Jetsam - Entangling Eels", () => {
//   It.skip("**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)__(This character counts as being named both Flotsam and Jetsam)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: flotsamAndJetsamEntanglingEels.cost,
//       Play: [flotsamAndJetsamEntanglingEels],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlotsamAndJetsamEntanglingEels.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
