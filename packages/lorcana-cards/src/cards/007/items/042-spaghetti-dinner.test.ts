// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KashekimAncientRuler,
//   SpaghettiDinner,
//   SuzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Spaghetti Dinner", () => {
//   It("FINE DINING {E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 1,
//       Play: [spaghettiDinner, kashekimAncientRuler, suzyMasterSeamstress],
//     });
//
//     Expect(testEngine.getLoreForPlayer()).toBe(0);
//     Await testEngine.activateCard(spaghettiDinner);
//     Expect(testEngine.getLoreForPlayer()).toBe(1);
//   });
// });
//
