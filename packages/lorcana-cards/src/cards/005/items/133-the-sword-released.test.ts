// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { theSwordReleased } from "@lorcanito/lorcana-engine/cards/005/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("The Sword Released", () => {
//   it.skip("**POWER APPOINTED** At the start of your turn, if you have a character in play with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.", () => {
//     const testStore = new TestStore({
//       inkwell: theSwordReleased.cost,
//       play: [theSwordReleased],
//     });
//
//     const cardUnderTest = testStore.getCard(theSwordReleased);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
