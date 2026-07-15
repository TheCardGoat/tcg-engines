// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurKingVictorious,
//   MerlinBackFromTheBermudas,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import {
//   ArthurDeterminedSquire,
//   LiloCausingAnUproar,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Arthur - Determined Squire", () => {
//   It("NO MORE BOOKS Skip your turn's Draw step.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: arthurDeterminedSquire.cost,
//       Play: [arthurDeterminedSquire],
//       Hand: [],
//       Deck: [liloCausingAnUproar],
//     });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(0);
//   });
//
//   It("NO MORE BOOKS Allows your opponent to draw.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: arthurDeterminedSquire.cost,
//         Play: [arthurDeterminedSquire],
//         Hand: [],
//         Deck: [],
//       },
//       {
//         Inkwell: arthurDeterminedSquire.cost,
//         Play: [],
//         Hand: [],
//         Deck: [liloCausingAnUproar],
//       },
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardsByZone("hand", "player_two")).toHaveLength(1);
//     Expect(testEngine.getCardModel(liloCausingAnUproar).zone).toEqual("hand");
//   });
//
//   It("NO MORE BOOKS Is no longer active when shifted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: arthurKingVictorious.cost,
//         Play: [arthurDeterminedSquire],
//         Hand: [arthurKingVictorious],
//         Deck: [merlinBackFromTheBermudas],
//       },
//       {
//         Inkwell: arthurDeterminedSquire.cost,
//         Play: [],
//         Hand: [],
//         Deck: [liloCausingAnUproar],
//       },
//     );
//
//     Await testEngine.shiftCard({
//       Shifted: arthurDeterminedSquire,
//       Shifter: arthurKingVictorious,
//     });
//     Await testEngine.skipTopOfStack();
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardsByZone("hand", "player_one")).toHaveLength(1);
//     Expect(testEngine.getCardModel(merlinBackFromTheBermudas).zone).toEqual(
//       "hand",
//     );
//   });
// });
//
