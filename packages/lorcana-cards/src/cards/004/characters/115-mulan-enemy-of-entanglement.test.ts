// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { packTactics } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { mulanEnemyOfEntanglement } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   GatheringKnowledgeAndWisdom,
//   RememberWhoYouAre,
// } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mulan - Enemy of Entanglement", () => {
//   It("**TIME TO SHINE** Whenever you play an action, this character gets +2 {S} this turn.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 90,
//       Play: [mulanEnemyOfEntanglement],
//       Hand: [gatheringKnowledgeAndWisdom, rememberWhoYouAre, packTactics],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mulanEnemyOfEntanglement);
//     Expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength);
//
//     TestEngine.playCard(gatheringKnowledgeAndWisdom);
//     Expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 2);
//
//     TestEngine.playCard(rememberWhoYouAre);
//     Expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 4);
//
//     TestEngine.playCard(packTactics);
//     Expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 6);
//   });
// });
//
