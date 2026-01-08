// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { noiAcrobaticBaby } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Noi - Acrobatic Baby", () => {
//   it.skip("**FANCY FOOTWORK** Whenever you play an action, this character takes no damage from challenges this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: noiAcrobaticBaby.cost,
//       play: [noiAcrobaticBaby],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", noiAcrobaticBaby.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
