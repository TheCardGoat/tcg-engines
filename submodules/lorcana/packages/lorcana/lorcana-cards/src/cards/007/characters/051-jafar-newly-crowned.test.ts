// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HesATramp,
//   IagoGiantSpectralParrot,
//   JafarNewlyCrowned,
//   OutOfOrder,
//   RajahGhostlyTiger,
// } from "@lorcanito/lorcana-engine/cards/007/";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jafar - Newly Crowned", () => {
//   It("THIS IS NOT DONE YET During an opponent’s turn, whenever one of your Illusion characters is banished, you may return that card to your hand.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: outOfOrder.cost + hesATramp.cost,
//         Hand: [outOfOrder, hesATramp],
//       },
//       {
//         Play: [jafarNewlyCrowned, rajahGhostlyTiger, iagoGiantSpectralParrot],
//       },
//     );
//
//     Await testEngine.playCard(
//       OutOfOrder,
//       {
//         Targets: [iagoGiantSpectralParrot],
//       },
//       True,
//     );
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getCardModel(iagoGiantSpectralParrot).zone).toBe("hand");
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.playCard(
//       HesATramp,
//       {
//         Targets: [rajahGhostlyTiger],
//       },
//       True,
//     );
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getCardModel(rajahGhostlyTiger).zone).toBe("hand");
//   });
// });
//
