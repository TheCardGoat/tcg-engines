// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { jafarLampThief } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jafar - Lamp Thief", () => {
//   it.skip("**I AM YOUR MASTER NOW** When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
//     const testStore = new TestStore({
//       inkwell: jafarLampThief.cost,
//       hand: [jafarLampThief],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", jafarLampThief.id);
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
