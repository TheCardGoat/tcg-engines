// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/003-cinderella-ballroom-sensation";
// Import { flynnRiderConfidentVagabond } from "@lorcanito/lorcana-engine/cards/002/characters/081-flynn-rider-confident-vagabond";
// Import { enigmaticInkcaster } from "@lorcanito/lorcana-engine/cards/010";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Enigmatic Inkcaster", () => {
//   It("should not gain lore when only itself has been played this turn", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: enigmaticInkcaster.cost,
//       Hand: [enigmaticInkcaster],
//     });
//
//     Const startingLore = testEngine.getPlayerLore();
//
//     // Play Enigmatic Inkcaster as the first card this turn
//     Const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     Await testEngine.playCard(cardUnderTest);
//
//     // Activate ITS OWN REWARD ability
//     // Should not gain lore because only itself was played (no other cards, condition not met)
//     CardUnderTest.activate("ITS OWN REWARD");
//
//     // Stack should be empty because condition wasn't met
//     Expect(testEngine.store.stackLayerStore.layers.length).toBe(0);
//
//     // Should not have gained lore
//     Expect(testEngine.getPlayerLore()).toBe(startingLore);
//   });
//
//   It("should gain 1 lore when 2 cards have been played this turn (including itself)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 4,
//       Hand: [flynnRiderConfidentVagabond, enigmaticInkcaster],
//     });
//
//     // Play first card (Flynn Rider)
//     Const firstCard = testEngine.getCardModel(flynnRiderConfidentVagabond);
//     Await testEngine.playCard(firstCard);
//
//     // Play Enigmatic Inkcaster as the second card this turn
//     Const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     Await testEngine.playCard(cardUnderTest);
//
//     Const loreBeforeActivation = testEngine.getPlayerLore();
//
//     // Now 2 cards have been played this turn (Flynn + Inkcaster itself)
//     // The condition requires 2+ cards, and Inkcaster counts itself
//     CardUnderTest.activate("ITS OWN REWARD");
//
//     // The ability auto-resolves because it has no targets to choose
//     // Should have gained 1 lore since 2 cards were played this turn
//     Expect(testEngine.getPlayerLore()).toBe(loreBeforeActivation + 1);
//   });
//
//   It("should gain 1 lore when 2 or more other cards have been played before it", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 5,
//       Hand: [
//         FlynnRiderConfidentVagabond,
//         CinderellaBallroomSensation,
//         EnigmaticInkcaster,
//       ],
//     });
//
//     // Play first card
//     Const firstCard = testEngine.getCardModel(flynnRiderConfidentVagabond);
//     Await testEngine.playCard(firstCard);
//
//     // Play second card
//     Const secondCard = testEngine.getCardModel(cinderellaBallroomSensation);
//     Await testEngine.playCard(secondCard);
//
//     // Play Enigmatic Inkcaster as the third card this turn
//     Const cardUnderTest = testEngine.getCardModel(enigmaticInkcaster);
//     Await testEngine.playCard(cardUnderTest);
//
//     Const loreBeforeActivation = testEngine.getPlayerLore();
//
//     // Now 2 other cards (Flynn and Cinderella) were played before Inkcaster
//     // The condition requires 2+ cards (excluding Inkcaster itself), so this should work
//     CardUnderTest.activate("ITS OWN REWARD");
//
//     // Only resolve if there's something on the stack
//     If (testEngine.store.stackLayerStore.layers.length > 0) {
//       Await testEngine.resolveTopOfStack({});
//     }
//
//     // Should have gained 1 lore since 2 other cards were played before Inkcaster
//     Expect(testEngine.getPlayerLore()).toBe(loreBeforeActivation + 1);
//   });
// });
//
