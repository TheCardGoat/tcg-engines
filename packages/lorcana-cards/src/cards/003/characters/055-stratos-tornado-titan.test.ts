// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { stratosTornadoTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Stratos - Tornado Titan", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_**CYCLONE** {E} – Gain lore equal to the number of Titan characters you have in play.", () => {
//     Const testStore = new TestStore({
//       Play: [stratosTornadoTitan],
//     });
//
//     Const cardUnderTest = testStore.getCard(stratosTornadoTitan);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
