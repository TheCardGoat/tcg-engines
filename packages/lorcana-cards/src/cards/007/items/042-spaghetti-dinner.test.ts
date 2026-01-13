// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import {
//   kashekimAncientRuler,
//   spaghettiDinner,
//   suzyMasterSeamstress,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Spaghetti Dinner", () => {
//   it("FINE DINING {E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 1,
//       play: [spaghettiDinner, kashekimAncientRuler, suzyMasterSeamstress],
//     });
//
//     expect(testEngine.getLoreForPlayer()).toBe(0);
//     await testEngine.activateCard(spaghettiDinner);
//     expect(testEngine.getLoreForPlayer()).toBe(1);
//   });
// });
//
