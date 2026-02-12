// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   MauiDemiGod,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { friendLikeMe } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
// Import { jimHawkinsSpaceTraveler } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   CinderellaMelodyWeaver,
//   RayaFierceProtector,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Friend Like Me", () => {
//   It("_(A character with cost 5 or more can exert to sing this song for free.)_Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: friendLikeMe.cost,
//         Hand: [friendLikeMe],
//         Deck: [
//           CinderellaMelodyWeaver,
//           RayaFierceProtector,
//           JimHawkinsSpaceTraveler,
//         ],
//       },
//       {
//         Deck: [liloMakingAWish, stichtNewDog, mauiDemiGod],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(friendLikeMe);
//     Const selfTopDeckCards = [
//       TestEngine.getCardModel(cinderellaMelodyWeaver),
//       TestEngine.getCardModel(rayaFierceProtector),
//       TestEngine.getCardModel(jimHawkinsSpaceTraveler),
//     ];
//
//     Const opponentTopDeckCards = [
//       TestEngine.getCardModel(liloMakingAWish),
//       TestEngine.getCardModel(stichtNewDog),
//       TestEngine.getCardModel(mauiDemiGod),
//     ];
//
//     Await testEngine.playCard(cardUnderTest);
//     SelfTopDeckCards.forEach((card) => {
//       Expect(card.zone).toEqual("inkwell");
//       Expect(card.ready).toEqual(false);
//     });
//     OpponentTopDeckCards.forEach((card) => {
//       Expect(card.zone).toEqual("inkwell");
//       Expect(card.ready).toEqual(false);
//     });
//   });
// });
//
