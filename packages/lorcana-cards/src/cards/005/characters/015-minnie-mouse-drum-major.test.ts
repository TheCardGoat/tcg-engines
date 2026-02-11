// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { olafFriendlySnowman } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { chernabogEvildoer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import {
//   MerlinIntellectualVisionary,
//   MinnieMouseCompassionateFriend,
//   MinnieMouseDrumMajor,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Drum Major", () => {
//   It("**PARADE ORDER** When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.", () => {
//     Const testStore = new TestStore({
//       Inkwell: minnieMouseDrumMajor.cost,
//       Hand: [minnieMouseDrumMajor],
//       Play: [minnieMouseCompassionateFriend],
//       Deck: [
//         MerlinIntellectualVisionary,
//         ChernabogEvildoer,
//         OlafFriendlySnowman,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(minnieMouseDrumMajor);
//     Const cardToShift = testStore.getCard(minnieMouseCompassionateFriend);
//     Const target = testStore.getCard(olafFriendlySnowman);
//
//     CardUnderTest.shift(cardToShift);
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Const topDeck = testStore.store.topDeckCard("player_one");
//
//     Expect(topDeck?.instanceId).toEqual(target.instanceId);
//   });
// });
//
