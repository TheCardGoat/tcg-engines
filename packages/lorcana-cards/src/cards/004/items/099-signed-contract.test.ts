// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { signedContract } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Signed Contract", () => {
//   It.skip("**FINE PRINT** Whenever an opponent plays a song, you may draw a card.", () => {
//     Const testStore = new TestStore({
//       Inkwell: signedContract.cost,
//       Play: [signedContract],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", signedContract.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
