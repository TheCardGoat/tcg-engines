// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goonsMaleficent } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { missBiancaIndefectibleAgent } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Miss Bianca - Indefectible Agent", () => {
//   It("KEEP HOPE Playing this character costs you 2 {I} less if you have an Ally character in play.", async () => {
//     Const testStore = new TestStore({
//       Inkwell: missBiancaIndefectibleAgent.cost - 2,
//       Hand: [missBiancaIndefectibleAgent],
//       Play: [goonsMaleficent],
//     });
//
//     Const cardUnderTest = testStore.getCard(missBiancaIndefectibleAgent);
//
//     CardUnderTest.playFromHand();
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
//   });
// });
//
