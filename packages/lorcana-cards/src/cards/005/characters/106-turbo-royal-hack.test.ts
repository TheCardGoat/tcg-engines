// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { turboRoyalHack } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Turbo - Royal Hack", () => {
//   it.skip("", () => {
//     const testStore = new TestStore({
//       inkwell: turboRoyalHack.cost,
//       play: [turboRoyalHack],
//     });
//
//     const cardUnderTest = testStore.getCard(turboRoyalHack);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
//
//   it.skip("**GAME JUMP** This character also counts as being named King Candy for **Shift**.", () => {
//     const testStore = new TestStore({
//       inkwell: turboRoyalHack.cost,
//       play: [turboRoyalHack],
//     });
//
//     const cardUnderTest = testStore.getCard(turboRoyalHack);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
