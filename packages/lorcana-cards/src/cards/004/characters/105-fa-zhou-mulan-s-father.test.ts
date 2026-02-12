// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { faZhouMulansFather } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fa Zhou - Mulan's Father", () => {
//   It.skip("**WAR WOUND** This character cannot challenge.**HEAD OF FAMILY** {E} - Ready chosen character named Mulan. They can’t quest for the rest of the turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: faZhouMulansFather.cost,
//       Play: [faZhouMulansFather],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FaZhouMulansFather.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
