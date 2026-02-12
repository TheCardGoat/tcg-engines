// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gatheringKnowledgeAndWisdom } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gathering Knowledge And Wisdom", () => {
//   It("Gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: gatheringKnowledgeAndWisdom.cost,
//       Hand: [gatheringKnowledgeAndWisdom],
//     });
//
//     Await testEngine.playCard(gatheringKnowledgeAndWisdom);
//
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
// });
//
