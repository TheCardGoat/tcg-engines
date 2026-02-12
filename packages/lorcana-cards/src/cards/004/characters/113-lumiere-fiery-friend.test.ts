// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AuroraTranquilPrincess,
//   LumiereFieryFriend,
//   PegasusFlyingSteed,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lumiere - Fiery Friend", () => {
//   It("**FERVENT ADDRESS** Your other characters get +1 {S}.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: lumiereFieryFriend.cost,
//         Hand: [lumiereFieryFriend],
//         Play: [pegasusFlyingSteed],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(lumiereFieryFriend);
//     Const target = testStore.getCard(pegasusFlyingSteed);
//
//     Expect(target.strength).toBe(pegasusFlyingSteed.strength);
//
//     CardUnderTest.playFromHand();
//
//     Expect(target.strength).toBe(pegasusFlyingSteed.strength + 1);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toBe(pegasusFlyingSteed.strength + 1);
//   });
//
//   It("Gives strength to characters with ward", () => {
//     Const testStore = new TestStore({
//       Play: [lumiereFieryFriend, auroraTranquilPrincess],
//     });
//
//     Const target = testStore.getCard(auroraTranquilPrincess);
//     Expect(target.strength).toBe(auroraTranquilPrincess.strength + 1);
//   });
// });
//
// Describe("Regression Tests", () => {
//   It("Doesn't give bonus to enemies", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: lumiereFieryFriend.cost,
//         Hand: [lumiereFieryFriend],
//       },
//       {
//         Play: [auroraTranquilPrincess],
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(lumiereFieryFriend);
//     Const target = testStore.getCard(auroraTranquilPrincess);
//
//     Expect(target.strength).toBe(auroraTranquilPrincess.strength);
//
//     CardUnderTest.playFromHand();
//
//     Expect(target.strength).toBe(auroraTranquilPrincess.strength);
//
//     TestStore.passTurn();
//
//     Expect(target.strength).toBe(auroraTranquilPrincess.strength);
//   });
// });
//
