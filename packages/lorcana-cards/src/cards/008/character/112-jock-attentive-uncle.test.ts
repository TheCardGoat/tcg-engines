// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { louieChillNephew } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   DeweyLovableShowoff,
//   JockAttentiveUncle,
//   TrampDapperRascal,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jock - Attentive Uncle", () => {
//   It("VOICE OF EXPERIENCE When you play this character, if you have 3 or more other characters in play, gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jockAttentiveUncle.cost,
//       Hand: [jockAttentiveUncle],
//       Play: [deweyLovableShowoff, louieChillNephew, trampDapperRascal],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(jockAttentiveUncle);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(testEngine.getLoreForPlayer()).toEqual(2);
//   });
//
//   It("VOICE OF EXPERIENCE When you play this character, if you have 3 total in play, do not gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jockAttentiveUncle.cost,
//       Hand: [jockAttentiveUncle],
//       Play: [deweyLovableShowoff, louieChillNephew],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(jockAttentiveUncle);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(testEngine.getLoreForPlayer()).toEqual(0);
//   });
// });
//
