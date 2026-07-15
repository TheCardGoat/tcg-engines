// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chernabogEvildoer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   ArthurNoviceSparrow,
//   ChacaImpressiveDaughter,
//   LudwigVonDrakeSelfproclaimedGenius,
//   PetePastryChomper,
//   TheQueenCruelestOfAll,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Chernabog - Evildoer", () => {
//   Describe("**THE POWER OF EVIL** When you play this character, pay 1 {I} less for every character card in your discard.", () => {
//     It("Playing full cost", () => {
//       Const testStore = new TestStore({
//         Inkwell: chernabogEvildoer.cost,
//         Hand: [chernabogEvildoer],
//       });
//
//       Const cardUnderTest = testStore.getCard(chernabogEvildoer);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("One damaged Character", () => {
//       Const testStore = new TestStore({
//         Inkwell: chernabogEvildoer.cost - 1,
//         Discard: [petePastryChomper],
//         Hand: [chernabogEvildoer],
//       });
//
//       Const cardUnderTest = testStore.getCard(chernabogEvildoer);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//
//     It("Five damaged Character", () => {
//       Const testStore = new TestStore({
//         Inkwell: 5,
//         Discard: [
//           PetePastryChomper,
//           ArthurNoviceSparrow,
//           ChacaImpressiveDaughter,
//           TheQueenCruelestOfAll,
//           LudwigVonDrakeSelfproclaimedGenius,
//         ],
//         Hand: [chernabogEvildoer],
//       });
//
//       Const cardUnderTest = testStore.getCard(chernabogEvildoer);
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getAvailableInkwellCardCount("player_one")).toBe(0);
//       Expect(cardUnderTest.zone).toBe("play");
//     });
//   });
//
//   It("**SUMMON THE SPIRITS** When you play this character, shuffle all character cards from your discard into your deck.", () => {
//     Const discard = [
//       PetePastryChomper,
//       ArthurNoviceSparrow,
//       ChacaImpressiveDaughter,
//       TheQueenCruelestOfAll,
//       LudwigVonDrakeSelfproclaimedGenius,
//     ];
//     Const testStore = new TestStore({
//       Inkwell: chernabogEvildoer.cost,
//       Discard: discard,
//       Hand: [chernabogEvildoer],
//     });
//
//     Const cardUnderTest = testStore.getCard(chernabogEvildoer);
//
//     CardUnderTest.playFromHand();
//
//     Expect(cardUnderTest.zone).toBe("play");
//     Discard.forEach((card) => {
//       Expect(testStore.getCard(card).zone).toBe("deck");
//     });
//   });
// });
//
