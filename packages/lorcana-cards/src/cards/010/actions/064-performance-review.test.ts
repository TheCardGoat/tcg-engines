// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BagheeraCautiousExplorer,
//   BigNoseLovesickPoet,
//   ChefLouisInOverHisHead,
//   PerformanceReview,
//   ScroogeMcduckCavernProspector,
// } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Performance Review", () => {
//   It("Draw cards equal to chosen ready character's lore value (lore 1)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: performanceReview.cost,
//       Hand: [performanceReview],
//       Play: [bigNoseLovesickPoet], // Has 1 lore
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(performanceReview);
//     Const targetCharacter = testEngine.getCardModel(bigNoseLovesickPoet);
//
//     Expect(targetCharacter.zone).toBe("play");
//     Expect(targetCharacter.lore).toBe(1);
//     Expect(targetCharacter.ready).toBe(true);
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     Expect(targetCharacter.exerted).toBe(true);
//     Expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 1 card (equal to character's lore)
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//   });
//
//   It("Draw cards equal to chosen ready character's lore value (lore 2)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: performanceReview.cost,
//       Hand: [performanceReview],
//       Play: [scroogeMcduckCavernProspector], // Has 2 lore
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(performanceReview);
//     Const targetCharacter = testEngine.getCardModel(
//       ScroogeMcduckCavernProspector,
//     );
//
//     Expect(targetCharacter.zone).toBe("play");
//     Expect(targetCharacter.lore).toBe(2);
//     Expect(targetCharacter.ready).toBe(true);
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     Expect(targetCharacter.exerted).toBe(true);
//     Expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 2 cards (equal to character's lore)
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(2);
//   });
//
//   It("Draw cards equal to chosen ready character's lore value (lore 3)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: performanceReview.cost,
//       Hand: [performanceReview],
//       Play: [chefLouisInOverHisHead], // Has 3 lore
//       Deck: 5,
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(performanceReview);
//     Const targetCharacter = testEngine.getCardModel(chefLouisInOverHisHead);
//
//     Expect(targetCharacter.zone).toBe("play");
//     Expect(targetCharacter.lore).toBe(3);
//     Expect(targetCharacter.ready).toBe(true);
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(1);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     // Resolve the action targeting the character
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] }, true);
//
//     // Resolve the exert effect (second layer created by exertChosenCharacter)
//     Await testEngine.resolveTopOfStack({ targets: [targetCharacter] });
//
//     // Character should be exerted after the effect
//     Expect(targetCharacter.exerted).toBe(true);
//     Expect(targetCharacter.ready).toBe(false);
//
//     // Should draw 3 cards (equal to character's lore)
//     Expect(testEngine.getZonesCardCount("player_one").hand).toBe(3);
//   });
//
//   It("Can only target ready characters (exerted character should not be valid target)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: performanceReview.cost,
//       Hand: [performanceReview],
//       Play: [bagheeraCautiousExplorer], // Has 1 lore
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(performanceReview);
//     Const character = testEngine.getCardModel(bagheeraCautiousExplorer);
//
//     // Exert the character
//     Character.updateCardMeta({ exerted: true });
//
//     Expect(character.zone).toBe("play");
//     Expect(character.ready).toBe(false);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     // The effect should be marked as invalid because there are no valid ready characters
//     // Stack should be empty since the effect can't resolve
//     Expect(testEngine.stackLayers.length).toBe(0);
//   });
// });
//
