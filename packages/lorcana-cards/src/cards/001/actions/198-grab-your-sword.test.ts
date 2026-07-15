// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   KuzcoTemperamentalEmperor,
//   MickeyMouseTrueFriend,
//   MoanaOfMotunui,
//   TeKaTheBurningOne,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { grabYourSword } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Grab Your Sword", () => {
//   It("Damages all opponent's characters", () => {
//     Const opponentsCards = [
//       MickeyMouseTrueFriend,
//       TeKaTheBurningOne,
//       MoanaOfMotunui,
//     ];
//     Const testStore = new TestStore(
//       {
//         Inkwell: grabYourSword.cost,
//         Hand: [grabYourSword],
//       },
//       {
//         Play: opponentsCards,
//       },
//     );
//
//     TestStore.store.playCardFromHand(
//       TestStore.getByZoneAndId("hand", grabYourSword.id).instanceId,
//     );
//
//     OpponentsCards.forEach((card) => {
//       Const cardModel = testStore.getByZoneAndId("play", card.id, "player_two");
//       Expect(cardModel.meta.damage).toEqual(2);
//     });
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Should damage characters with ward", async () => {
//     Const opponentsCards = [
//       MickeyMouseTrueFriend,
//       KuzcoTemperamentalEmperor,
//       MoanaOfMotunui,
//     ];
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: grabYourSword.cost,
//         Hand: [grabYourSword],
//       },
//       {
//         Play: opponentsCards,
//       },
//     );
//
//     Await testEngine.playCard(grabYourSword);
//
//     OpponentsCards.forEach((card) => {
//       Const cardModel = testEngine.testStore.getCard(card);
//       Expect(cardModel.meta.damage).toEqual(2);
//     });
//   });
// });
//
