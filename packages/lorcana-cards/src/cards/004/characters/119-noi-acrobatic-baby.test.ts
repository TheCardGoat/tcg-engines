// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { noiAcrobaticBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Noi - Acrobatic Baby", () => {
//   It.skip("**FANCY FOOTWORK** Whenever you play an action, this character takes no damage from challenges this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: noiAcrobaticBaby.cost,
//       Play: [noiAcrobaticBaby],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", noiAcrobaticBaby.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
