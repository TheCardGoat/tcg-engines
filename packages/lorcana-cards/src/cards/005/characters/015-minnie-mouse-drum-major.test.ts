// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { olafFriendlySnowman } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { chernabogEvildoer } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import {
//   merlinIntellectualVisionary,
//   minnieMouseCompassionateFriend,
//   minnieMouseDrumMajor,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Minnie Mouse - Drum Major", () => {
//   it("**PARADE ORDER** When you play this character, if you used **Shift** to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.", () => {
//     const testStore = new TestStore({
//       inkwell: minnieMouseDrumMajor.cost,
//       hand: [minnieMouseDrumMajor],
//       play: [minnieMouseCompassionateFriend],
//       deck: [
//         merlinIntellectualVisionary,
//         chernabogEvildoer,
//         olafFriendlySnowman,
//       ],
//     });
//
//     const cardUnderTest = testStore.getCard(minnieMouseDrumMajor);
//     const cardToShift = testStore.getCard(minnieMouseCompassionateFriend);
//     const target = testStore.getCard(olafFriendlySnowman);
//
//     cardUnderTest.shift(cardToShift);
//
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     const topDeck = testStore.store.topDeckCard("player_one");
//
//     expect(topDeck?.instanceId).toEqual(target.instanceId);
//   });
// });
//
