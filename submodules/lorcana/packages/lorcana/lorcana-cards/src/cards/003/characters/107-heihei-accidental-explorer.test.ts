// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { heiheiAccidentalExplorer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("HeiHei - Accidental Explorer", () => {
//   It.skip("**MINDLESS WANDERING** Once per turn, when this character moves to a location, each opponent loses 1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: heiheiAccidentalExplorer.cost,
//       Play: [heiheiAccidentalExplorer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HeiheiAccidentalExplorer.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
