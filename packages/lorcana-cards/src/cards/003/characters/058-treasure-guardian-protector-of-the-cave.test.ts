// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { treasureGuardianProtectorOfTheCave } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Treasure Guardian - Protector of the Cave", () => {
//   It.skip("**WHO DISTURBS MY SLUMBER?** This character can't challenge or quest unless it is at a location.", () => {
//     Const testStore = new TestStore({
//       Inkwell: treasureGuardianProtectorOfTheCave.cost,
//       Play: [treasureGuardianProtectorOfTheCave],
//     });
//
//     Const cardUnderTest = testStore.getCard(treasureGuardianProtectorOfTheCave);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
