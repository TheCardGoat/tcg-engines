// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tianaRestaurantOwner } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   AuroraHoldingCourt,
//   MulanConsiderateDiplomat,
//   TheQueenWickedAndVain,
// } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Aurora - Holding Court", () => {
//   It("[QUEEN] ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: theQueenWickedAndVain.cost - 1,
//       Play: [auroraHoldingCourt],
//       Hand: [theQueenWickedAndVain],
//     });
//
//     Await testEngine.questCard(auroraHoldingCourt);
//     Await testEngine.playCard(theQueenWickedAndVain);
//
//     Expect(testEngine.getCardModel(theQueenWickedAndVain).zone).toEqual("play");
//   });
//
//   It("[PRINCESS] ROYAL WELCOME Whenever this character quests, you pay 1 {I} less for the next Princess or Queen character you play this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mulanConsiderateDiplomat.cost - 1,
//       Play: [auroraHoldingCourt],
//       Hand: [mulanConsiderateDiplomat],
//     });
//
//     Await testEngine.questCard(auroraHoldingCourt);
//     Await testEngine.playCard(mulanConsiderateDiplomat);
//
//     Expect(testEngine.getCardModel(mulanConsiderateDiplomat).zone).toEqual(
//       "play",
//     );
//   });
//
//   Describe("Regression Tests", () => {
//     It("Double Aurora Playing Double Princess", async () => {
//       Const initialInkwell = tianaRestaurantOwner.cost * 2;
//       Const testEngine = new TestEngine({
//         Inkwell: initialInkwell, // -1 less for each Aurora
//         Play: [auroraHoldingCourt, auroraHoldingCourt],
//         Hand: [tianaRestaurantOwner, tianaRestaurantOwner],
//       });
//
//       Await testEngine.questCard(
//         TestEngine.getCardModel(auroraHoldingCourt, 0),
//       );
//       Await testEngine.questCard(
//         TestEngine.getCardModel(auroraHoldingCourt, 1),
//       );
//
//       Expect(testEngine.getAvailableInkwellCardCount()).toEqual(initialInkwell);
//
//       Await testEngine.playCard(
//         TestEngine.getCardModel(tianaRestaurantOwner, 0),
//       );
//
//       Expect(testEngine.getAvailableInkwellCardCount()).toEqual(
//         InitialInkwell - (tianaRestaurantOwner.cost - 2), // 2 Auroras, so 2 less inkwell
//       );
//
//       Await testEngine.playCard(
//         TestEngine.getCardModel(tianaRestaurantOwner, 1),
//       );
//
//       Expect(testEngine.getAvailableInkwellCardCount()).toEqual(
//         InitialInkwell -
//           (tianaRestaurantOwner.cost - 2) -
//           TianaRestaurantOwner.cost, // second tiana should cost full cost
//       );
//     });
//   });
// });
//
