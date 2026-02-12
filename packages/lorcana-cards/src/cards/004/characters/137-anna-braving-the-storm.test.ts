// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { annaBravingTheStorm } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Anna - Braving the Storm", () => {
//   It.skip("**I WAS BORN READY** If you have another Hero character in play, this character gets +1 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: annaBravingTheStorm.cost,
//       Play: [annaBravingTheStorm],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       AnnaBravingTheStorm.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
