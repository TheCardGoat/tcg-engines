// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   FriendsOnTheOtherSide,
//   GrabYourSword,
//   SuddenChill,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   GoofyKnightForADay,
//   PrinceJohnGreediestOfAll,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import {
//   AladdinResoluteSwordsman,
//   AuroraTranquilPrincess,
//   FaLiMulansMother,
//   TheMusesProclaimersOfHeroes,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Muses - Proclaimers of Heroes", () => {
//   Describe("**THE GOSPEL TRUTH** Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.", () => {
//     It("should return own character with 2 {S} or less to own hand when a song is played", () => {
//       Const testStore = new TestStore({
//         Inkwell: grabYourSword.cost,
//         Play: [
//           TheMusesProclaimersOfHeroes,
//           PrinceJohnGreediestOfAll,
//           AuroraTranquilPrincess,
//           FaLiMulansMother,
//         ],
//         Hand: [grabYourSword],
//       });
//
//       Const notTargetOne = testStore.getCard(auroraTranquilPrincess);
//       Const notTargetTwo = testStore.getCard(faLiMulansMother);
//       Const notTargetThree = testStore.getCard(theMusesProclaimersOfHeroes);
//
//       Const target = testStore.getCard(princeJohnGreediestOfAll);
//       Const song = testStore.getByZoneAndId("hand", grabYourSword.id);
//       Song.playFromHand();
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("hand");
//
//       [notTargetOne, notTargetTwo, notTargetThree].forEach((card) => {
//         Expect(card.zone).toBe("play");
//       });
//     });
//
//     It("should return opponents character with 2 {S} or less to opponents hand when a song is played", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: grabYourSword.cost,
//           Play: [theMusesProclaimersOfHeroes],
//           Hand: [friendsOnTheOtherSide],
//           Deck: 3,
//         },
//         {
//           Play: [
//             AladdinResoluteSwordsman,
//             PrinceJohnGreediestOfAll,
//             AuroraTranquilPrincess,
//             FaLiMulansMother,
//           ],
//         },
//       );
//       Const notTargetOne = testStore.getCard(auroraTranquilPrincess);
//       Const notTargetTwo = testStore.getCard(faLiMulansMother);
//       Const notTargetThree = testStore.getCard(princeJohnGreediestOfAll);
//
//       Const song = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
//       Const opponentCardToReturn = testStore.getByZoneAndId(
//         "play",
//         AladdinResoluteSwordsman.id,
//         "player_two",
//       );
//       Song.playFromHand();
//
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ targets: [opponentCardToReturn] });
//
//       Expect(opponentCardToReturn.zone).toBe("hand");
//
//       [notTargetOne, notTargetTwo, notTargetThree].forEach((card) => {
//         Expect(card.zone).toBe("play");
//       });
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("Skipping muses effect during an song that requires response from opponent", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: suddenChill.cost,
//         Play: [theMusesProclaimersOfHeroes, liloMakingAWish],
//         Hand: [suddenChill],
//       },
//       {
//         Hand: [goofyKnightForADay],
//       },
//     );
//
//     Const target = testStore.getCard(liloMakingAWish);
//     Const song = testStore.getCard(suddenChill);
//
//     Const opponentsCard = testStore.getCard(goofyKnightForADay);
//
//     Song.playFromHand();
//     Expect(testStore.stackLayers).toHaveLength(2);
//     Console.log(JSON.stringify(testStore.stackLayers[0]));
//     Expect(testStore.store.priorityPlayer).toEqual("player_two");
//
//     TestStore.changePlayer("player_two");
//     TestStore.resolveTopOfStack({ targets: [opponentsCard] }, true);
//     Expect(testStore.stackLayers).toHaveLength(1);
//     Expect(opponentsCard.zone).toEqual("discard");
//
//     TestStore.changePlayer("player_one");
//     TestStore.skipOptionalAbility();
//     Expect(target.zone).toBe("play");
//     Expect(testStore.stackLayers).toHaveLength(0);
//   });
// });
//
