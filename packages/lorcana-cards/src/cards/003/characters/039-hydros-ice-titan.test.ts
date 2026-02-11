// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { hydrosIceTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hydros - Ice Titan", () => {
//   It.skip("**BLIZZARD** {E} − Exert chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: hydrosIceTitan.cost,
//       Play: [hydrosIceTitan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", hydrosIceTitan.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
