// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { plutoRescueDog } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pluto - Rescue Dog", () => {
//   It.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: plutoRescueDog.cost,
//       Hand: [plutoRescueDog],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", plutoRescueDog.id);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
