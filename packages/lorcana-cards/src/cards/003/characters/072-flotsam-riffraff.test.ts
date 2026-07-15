// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { flotsamRiffraff } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flotsam - Riffraff", () => {
//   It.skip("**EERIE PAIR** Your characters named Jetsam get +3 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: flotsamRiffraff.cost,
//       Play: [flotsamRiffraff],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", flotsamRiffraff.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
