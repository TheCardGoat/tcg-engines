// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { packTactics } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { mulanEnemyOfEntanglement } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import {
//   gatheringKnowledgeAndWisdom,
//   rememberWhoYouAre,
// } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mulan - Enemy of Entanglement", () => {
//   it("**TIME TO SHINE** Whenever you play an action, this character gets +2 {S} this turn.", () => {
//     const testEngine = new TestEngine({
//       inkwell: 90,
//       play: [mulanEnemyOfEntanglement],
//       hand: [gatheringKnowledgeAndWisdom, rememberWhoYouAre, packTactics],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mulanEnemyOfEntanglement);
//     expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength);
//
//     testEngine.playCard(gatheringKnowledgeAndWisdom);
//     expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 2);
//
//     testEngine.playCard(rememberWhoYouAre);
//     expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 4);
//
//     testEngine.playCard(packTactics);
//     expect(cardUnderTest.strength).toBe(mulanEnemyOfEntanglement.strength + 6);
//   });
// });
//
