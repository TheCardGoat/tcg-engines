// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   bagheeraCautiousExplorer,
//   bigNoseLovesickPoet,
//   chefLouisInOverHisHead,
//   performanceReview,
//   scroogeMcduckCavernProspector,
// } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Performance Review", () => {
//   it("Draw cards equal to chosen ready character's lore value (lore 1)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: performanceReview.cost,
//       hand: [performanceReview],
//       play: [bigNoseLovesickPoet], // Has 1 lore
//       deck: 5,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(performanceReview);
//     const targetCharacter = testEngine.getCardModel(bigNoseLovesickPoet);
//
//     expect(targetCharacter.zone).toBe("play");
//     expect(targetCharacter.lore).toBe(1);
//     expect(targetCharacter.ready).toBe(true);
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     expect(targetCharacter.exerted).toBe(true);
//     expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 1 card (equal to character's lore)
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
//
//   it("Draw cards equal to chosen ready character's lore value (lore 2)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: performanceReview.cost,
//       hand: [performanceReview],
//       play: [scroogeMcduckCavernProspector], // Has 2 lore
//       deck: 5,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(performanceReview);
//     const targetCharacter = testEngine.getCardModel(
//       scroogeMcduckCavernProspector,
//     );
//
//     expect(targetCharacter.zone).toBe("play");
//     expect(targetCharacter.lore).toBe(2);
//     expect(targetCharacter.ready).toBe(true);
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     expect(targetCharacter.exerted).toBe(true);
//     expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 2 cards (equal to character's lore)
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//   });
//
//   it("Draw cards equal to chosen ready character's lore value (lore 3)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: performanceReview.cost,
//       hand: [performanceReview],
//       play: [chefLouisInOverHisHead], // Has 3 lore
//       deck: 5,
//     });
//
//     const cardUnderTest = testEngine.getCardModel(performanceReview);
//     const targetCharacter = testEngine.getCardModel(chefLouisInOverHisHead);
//
//     expect(targetCharacter.zone).toBe("play");
//     expect(targetCharacter.lore).toBe(3);
//     expect(targetCharacter.ready).toBe(true);
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     expect(targetCharacter.exerted).toBe(true);
//     expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 3 cards (equal to character's lore)
//     expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//   });
//
//   it("Can only target ready characters (exerted character should not be valid target)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: performanceReview.cost,
//       hand: [performanceReview],
//       play: [bagheeraCautiousExplorer], // Has 1 lore
//     });
//
//     const cardUnderTest = testEngine.getCardModel(performanceReview);
//     const character = testEngine.getCardModel(bagheeraCautiousExplorer);
//
//     // Exert the character
//     character.updateCardMeta({ exerted: true });
//
//     expect(character.zone).toBe("play");
//     expect(character.ready).toBe(false);
//
//     await testEngine.playCard(cardUnderTest);
//
//     // The effect should be marked as invalid because there are no valid ready characters
//     // Stack should be empty since the effect can't resolve
//     expect(testEngine.stackLayers.length).toBe(0);
//   });
// });
//
