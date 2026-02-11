// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { badanonVillainSupportCenter } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bad-Anon - Villain Support Center", () => {
//   It.skip("**THERE'S NO ONE I'D RATHER BE THAN ME** Villain {E}, 3 {I} - Play a character with the same name as this character for free' while here.", () => {
//     Const testStore = new TestStore({
//       Inkwell: badanonVillainSupportCenter.cost,
//       Play: [badanonVillainSupportCenter],
//     });
//
//     Const cardUnderTest = testStore.getCard(badanonVillainSupportCenter);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
