// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { balooVonBruinwaldXiii } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Baloo - von Bruinwald XIII", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**LET'S MAKE LIKE A TREE** When this character is banished, gain 2 lore.", () => {
//     Const testStore = new TestStore({
//       Play: [balooVonBruinwaldXiii],
//     });
//
//     Const cardUnderTest = testStore.getCard(balooVonBruinwaldXiii);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
