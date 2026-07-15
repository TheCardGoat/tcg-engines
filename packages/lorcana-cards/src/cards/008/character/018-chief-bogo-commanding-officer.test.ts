// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { dragonFire } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   ChiefBogoCommandingOfficer,
//   JimDearBelovedHusband,
//   LafayetteSleepyDachshund,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chief Bogo - Commanding Officer", () => {
//   It("SENDING BACKUP During an opponent’s turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it’s a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: dragonFire.cost,
//         Hand: [dragonFire],
//       },
//       {
//         Deck: [lafayetteSleepyDachshund],
//         Play: [chiefBogoCommandingOfficer, jimDearBelovedHusband],
//       },
//     );
//
//     Await testEngine.playCard(
//       DragonFire,
//       { targets: [jimDearBelovedHusband] },
//       True,
//     );
//     Expect(testEngine.getCardModel(jimDearBelovedHusband).zone).toBe("discard");
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getCardModel(lafayetteSleepyDachshund).zone).toBe("play");
//   });
// });
//
