// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BalooVonBruinwaldXiii,
//   MoanaBornLeader,
//   MrSnoopsIneptBusinessman,
//   PuaPotbelliedBuddy,
// } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { motunuiIslandParadise } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Moana - Born Leader", () => {
//   It("**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Moana._)", () => {
//     Const testStore = new TestStore({
//       Play: [moanaBornLeader],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", moanaBornLeader.id);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**WELCOME TO MY BOAT** Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.", async () => {
//     Const testStore = new TestEngine({
//       Inkwell: motunuiIslandParadise.moveCost * 3,
//       Play: [
//         MoanaBornLeader,
//         MotunuiIslandParadise,
//         PuaPotbelliedBuddy,
//         BalooVonBruinwaldXiii,
//         MrSnoopsIneptBusinessman,
//       ],
//     });
//
//     Await testStore.moveToLocation({
//       Location: motunuiIslandParadise,
//       Character: moanaBornLeader,
//     });
//
//     // Exerted but not at location
//     Await testStore.tapCard(mrSnoopsIneptBusinessman);
//
//     Const charsAtLocation = [puaPotbelliedBuddy, balooVonBruinwaldXiii];
//     For (const card of charsAtLocation) {
//       Await testStore.tapCard(card);
//       Await testStore.moveToLocation({
//         Location: motunuiIslandParadise,
//         Character: card,
//       });
//     }
//
//     Await testStore.questCard(moanaBornLeader);
//
//     // Only characters at location should be ready
//     CharsAtLocation.forEach((card) => {
//       Const cardModel = testStore.getCardModel(card);
//       Expect(cardModel.ready).toBe(true);
//       Expect(cardModel.hasQuestRestriction).toBe(true);
//     });
//
//     // Moana herself and cards outside location should not be affected
//     [moanaBornLeader, mrSnoopsIneptBusinessman].forEach((card) => {
//       Const cardModel = testStore.getCardModel(card);
//       Expect(cardModel.ready).toBe(false);
//       Expect(cardModel.hasQuestRestriction).toBe(false);
//     });
//   });
// });
//
