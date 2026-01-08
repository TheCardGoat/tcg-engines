// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/003-cinderella-ballroom-sensation";
// import { flynnRiderConfidentVagabond } from "@lorcanito/lorcana-engine/cards/002/characters/081-flynn-rider-confident-vagabond";
// import { enigmaticInkcaster } from "@lorcanito/lorcana-engine/cards/010";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Enigmatic Inkcaster", () => {
//   it("should not gain lore when only itself has been played this turn", async () => {
//     const testEngine = new TestEngine({
//       inkwell: enigmaticInkcaster.cost,
//       hand: [enigmaticInkcaster],
//     });
//
//     const startingLore = testEngine.getPlayerLore();
//
//     // Play Enigmatic Inkcaster as the first card this turn
//     const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     await testEngine.playCard(cardUnderTest);
//
//     // Activate ITS OWN REWARD ability
//     // Should not gain lore because only itself was played (no other cards, condition not met)
//     cardUnderTest.activate("ITS OWN REWARD");
//
//     // Stack should be empty because condition wasn't met
//     expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//
//     // Should not have gained lore
//     expect(testEngine.getPlayerLore()).toBe(startingLore);
//   });
//
//   it("should gain 1 lore when 2 cards have been played this turn (including itself)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 4,
//       hand: [flynnRiderConfidentVagabond, enigmaticInkcaster],
//     });
//
//     // Play first card (Flynn Rider)
//     const firstCard = testEngine.getCardModel(flynnRiderConfidentVagabond);
//     await testEngine.playCard(firstCard);
//
//     // Play Enigmatic Inkcaster as the second card this turn
//     const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     await testEngine.playCard(cardUnderTest);
//
//     const loreBeforeActivation = testEngine.getPlayerLore();
//
//     // Now 2 cards have been played this turn (Flynn + Inkcaster itself)
//     // The condition requires 2+ cards, and Inkcaster counts itself
//     cardUnderTest.activate("ITS OWN REWARD");
//
//     // The ability auto-resolves because it has no targets to choose
//     // Should have gained 1 lore since 2 cards were played this turn
//     expect(testEngine.getPlayerLore()).toBe(loreBeforeActivation + 1);
//   });
//
//   it("should gain 1 lore when 2 or more other cards have been played before it", async () => {
//     const testEngine = new TestEngine({
//       inkwell: 5,
//       hand: [
//         flynnRiderConfidentVagabond,
//         cinderellaBallroomSensation,
//         enigmaticInkcaster,
//       ],
//     });
//
//     // Play first card
//     const firstCard = testEngine.getCardModel(flynnRiderConfidentVagabond);
//     await testEngine.playCard(firstCard);
//
//     // Play second card
//     const secondCard = testEngine.getCardModel(cinderellaBallroomSensation);
//     await testEngine.playCard(secondCard);
//
//     // Play Enigmatic Inkcaster as the third card this turn
//     const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     await testEngine.playCard(cardUnderTest);
//
//     const loreBeforeActivation = testEngine.getPlayerLore();
//
//     // Now 2 other cards (Flynn and Cinderella) were played before Inkcaster
//     // The condition requires 2+ cards (excluding Inkcaster itself), so this should work
//     cardUnderTest.activate("ITS OWN REWARD");
//
//     // Only resolve if there's something on the stack
//     if (testEngine.store.stackLayerStore.layers.length > 0) {
//       await testEngine.resolveTopOfStack({});
//     }
//
//     // Should have gained 1 lore since 2 other cards were played before Inkcaster
//     expect(testEngine.getPlayerLore()).toBe(loreBeforeActivation + 1);
//   });
// });
//
