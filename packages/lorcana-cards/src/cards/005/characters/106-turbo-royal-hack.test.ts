// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { turboRoyalHack } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Turbo - Royal Hack", () => {
//   It.skip("", () => {
//     Const testStore = new TestStore({
//       Inkwell: turboRoyalHack.cost,
//       Play: [turboRoyalHack],
//     });
//
//     Const cardUnderTest = testStore.getCard(turboRoyalHack);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
//
//   It.skip("**GAME JUMP** This character also counts as being named King Candy for **Shift**.", () => {
//     Const testStore = new TestStore({
//       Inkwell: turboRoyalHack.cost,
//       Play: [turboRoyalHack],
//     });
//
//     Const cardUnderTest = testStore.getCard(turboRoyalHack);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
