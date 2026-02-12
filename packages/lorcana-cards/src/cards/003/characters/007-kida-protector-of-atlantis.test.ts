// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KidaProtectorOfAtlantis,
//   KingLouieBandleader,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Kida - Protector of Atlantis", () => {
//   It("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Kida.)_**PERHAPS WE CAN SAVE OUR FUTURE** When you play this character, all characters get -3 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore({
//       Play: [kidaProtectorOfAtlantis],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       KidaProtectorOfAtlantis.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**PERHAPS WE CAN SAVE OUR FUTURE** When you play this character, all characters get -3 {S} until the start of your next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: kidaProtectorOfAtlantis.cost,
//         Hand: [kidaProtectorOfAtlantis],
//         Deck: 1,
//       },
//       {
//         Play: [kingLouieBandleader],
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(kidaProtectorOfAtlantis);
//     Const targetCard = testStore.getCard(kingLouieBandleader);
//
//     CardUnderTest.play();
//     Expect(targetCard.strength).toBe(kingLouieBandleader.strength - 3);
//     Expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength - 3);
//
//     TestStore.passTurn();
//
//     Expect(targetCard.strength).toBe(kingLouieBandleader.strength - 3);
//     Expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength - 3);
//
//     TestStore.passTurn();
//
//     Expect(targetCard.strength).toBe(kingLouieBandleader.strength);
//     Expect(cardUnderTest.strength).toBe(kidaProtectorOfAtlantis.strength);
//   });
// });
//
