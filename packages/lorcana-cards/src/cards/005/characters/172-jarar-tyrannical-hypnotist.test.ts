// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   JafarTyrannicalHypnotist,
//   NalaMischievousCub,
//   SirEctorCastleLord,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jarar - Tyrannical Hypnotist", () => {
//   It("Challenger", () => {
//     Const testStore = new TestStore({
//       Play: [jafarTyrannicalHypnotist],
//     });
//
//     Const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);
//
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
//
//   Describe("**INTIMIDATING GAZE** Opposing characters with cost 4 or less can’t challenge.", () => {
//     It("Opposing characters with cost 4 or less can’t challenge.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [nalaMischievousCub],
//           Deck: 1,
//         },
//         {
//           Play: [jafarTyrannicalHypnotist],
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const target = testStore.getCard(nalaMischievousCub);
//
//       Expect(target.canChallenge(cardUnderTest)).toBe(false);
//
//       TestStore.passTurn();
//       TestStore.passTurn();
//
//       Expect(target.canChallenge(cardUnderTest)).toBe(false);
//     });
//
//     It("Opposing characters with cost 5 or more can challenge.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [sirEctorCastleLord],
//           Deck: 1,
//         },
//         {
//           Play: [jafarTyrannicalHypnotist],
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(jafarTyrannicalHypnotist);
//       CardUnderTest.updateCardMeta({ exerted: true });
//
//       Const target = testStore.getCard(sirEctorCastleLord);
//
//       Expect(target.canChallenge(cardUnderTest)).toBe(true);
//
//       TestStore.passTurn();
//       TestStore.passTurn();
//
//       CardUnderTest.updateCardMeta({ exerted: true });
//       Expect(target.canChallenge(cardUnderTest)).toBe(true);
//     });
//   });
// });
//
