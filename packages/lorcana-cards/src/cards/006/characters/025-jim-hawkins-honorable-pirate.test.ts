// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jimHawkinsHonorablePirate } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jim Hawkins - Honorable Pirate", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**HIRE A CREW** When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.", () => {
//     Const testStore = new TestStore({
//       Play: [jimHawkinsHonorablePirate],
//     });
//
//     Const cardUnderTest = testStore.getCard(jimHawkinsHonorablePirate);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
