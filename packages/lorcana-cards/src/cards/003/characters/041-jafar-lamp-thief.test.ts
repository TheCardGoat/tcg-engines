// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { jafarLampThief } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar - Lamp Thief", () => {
//   It.skip("**I AM YOUR MASTER NOW** When you play this character, look at the top 2 cards of your deck. Put one on the top of your deck and the other on the bottom.", () => {
//     Const testStore = new TestStore({
//       Inkwell: jafarLampThief.cost,
//       Hand: [jafarLampThief],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", jafarLampThief.id);
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
