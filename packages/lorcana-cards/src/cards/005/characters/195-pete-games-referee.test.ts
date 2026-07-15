// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { peteGamesReferee } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pete - Games Referee", () => {
//   It("**BLOW THE WHISTLE** When you play this character, opponents can’t play actions until the start of your next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: peteGamesReferee.cost,
//         Hand: [peteGamesReferee],
//         Deck: 1,
//       },
//       {
//         Deck: 7,
//         Hand: [
//           FriendsOnTheOtherSide,
//           LiloMakingAWish,
//           ForbiddenMountainMaleficentsCastle,
//           DingleHopper,
//         ],
//         Inkwell:
//           FriendsOnTheOtherSide.cost +
//           LiloMakingAWish.cost +
//           ForbiddenMountainMaleficentsCastle.cost +
//           DingleHopper.cost,
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(peteGamesReferee);
//     CardUnderTest.playFromHand();
//
//     TestStore.passTurn();
//
//     Const actionTarget = testStore.getCard(friendsOnTheOtherSide);
//     Const itemTarget = testStore.getCard(dingleHopper);
//     Const locationTarget = testStore.getCard(
//       ForbiddenMountainMaleficentsCastle,
//     );
//     Const characterTarget = testStore.getCard(liloMakingAWish);
//
//     ActionTarget.playFromHand();
//     Expect(actionTarget.zone).toEqual("hand");
//
//     ItemTarget.playFromHand();
//     Expect(itemTarget.zone).toEqual("play");
//
//     LocationTarget.playFromHand();
//     Expect(locationTarget.zone).toEqual("play");
//
//     CharacterTarget.playFromHand();
//     Expect(characterTarget.zone).toEqual("play");
//
//     TestStore.passTurn();
//     TestStore.passTurn();
//
//     ActionTarget.playFromHand();
//     Expect(actionTarget.zone).toEqual("discard");
//   });
// });
//
