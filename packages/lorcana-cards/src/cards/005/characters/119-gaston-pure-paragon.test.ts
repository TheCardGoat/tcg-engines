// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurNoviceSparrow,
//   ChacaImpressiveDaughter,
//   GastonPureParagon,
//   LudwigVonDrakeSelfproclaimedGenius,
//   PetePastryChomper,
//   TheQueenCruelestOfAll,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gaston - Pure Paragon", () => {
//   Describe("**A MAN AMONG MEN!** For each damaged character you have in play, you pay 2 {I} less to play this character.<br/>**Rush** _(This character can challenge the turn they're played.)_", () => {
//     It("Playing full cost", () => {
//       Const testStore = new TestStore({
//         Inkwell: gastonPureParagon.cost,
//         Hand: [gastonPureParagon],
//       });
//
//       Const cardUnderTest = testStore.getCard(gastonPureParagon);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("One damaged Character", () => {
//       Const testStore = new TestStore({
//         Inkwell: gastonPureParagon.cost - 2,
//         Play: [petePastryChomper],
//         Hand: [gastonPureParagon],
//       });
//
//       Const cardUnderTest = testStore.getCard(gastonPureParagon);
//
//       Const pete = testStore.getCard(petePastryChomper);
//       Pete.updateCardDamage(1, "add");
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("Five damaged Character", () => {
//       Const cardsInPlay = [
//         PetePastryChomper,
//         ArthurNoviceSparrow,
//         ChacaImpressiveDaughter,
//         TheQueenCruelestOfAll,
//         LudwigVonDrakeSelfproclaimedGenius,
//       ];
//       Const testStore = new TestStore({
//         Inkwell: 0,
//         Play: cardsInPlay,
//         Hand: [gastonPureParagon],
//       });
//
//       Const cardUnderTest = testStore.getCard(gastonPureParagon);
//
//       Const pete = testStore.getCard(petePastryChomper);
//
//       CardsInPlay.forEach((card) => {
//         TestStore.getCard(card).updateCardDamage(1, "add");
//       });
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
// });
//
