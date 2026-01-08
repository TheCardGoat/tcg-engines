// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gathering Knowledge And Wisdom", () => {
//   it("Gain 2 lore.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: gatheringKnowledgeAndWisdom.cost,
//       hand: [gatheringKnowledgeAndWisdom],
//     });
//
//     await testEngine.playCard(gatheringKnowledgeAndWisdom);
//
//     expect(testEngine.getPlayerLore()).toBe(2);
//   });
// });
//
