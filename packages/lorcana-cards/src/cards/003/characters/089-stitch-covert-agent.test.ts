// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stitchCovertAgent } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stitch - Covert Agent", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_**HIDE** While this character is at a location, he gains **Ward**. _(Opponents can't choose them except to challenge.)_", () => {
//     Const testStore = new TestStore({
//       Play: [stitchCovertAgent],
//     });
//
//     Const cardUnderTest = testStore.getCard(stitchCovertAgent);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
