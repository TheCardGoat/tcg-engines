// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseWaywardSorcerer,
//   minnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { faLiMulansMother } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Hidden Cove - Tranquil Haven", () => {
//   it("**REVITALIZING WATERS** Characters get +1 {S} and +1 {W}️ while here.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: hiddenCoveTranquilHaven.moveCost * 2,
//         play: [
//           hiddenCoveTranquilHaven,
//           faLiMulansMother,
//           minnieMouseBelovedPrincess,
//         ],
//         deck: 2,
//       },
//       {
//         play: [mickeyMouseWaywardSorcerer],
//       },
//     );
//
//     const character = testStore.getCard(faLiMulansMother);
//     const anotherChar = testStore.getCard(minnieMouseBelovedPrincess);
//     const location = testStore.getCard(hiddenCoveTranquilHaven);
//
//     expect(character.strength).toEqual(faLiMulansMother.strength);
//     expect(character.willpower).toEqual(faLiMulansMother.willpower);
//
//     character.enterLocation(location);
//     anotherChar.enterLocation(location);
//
//     expect(character.strength).toEqual(faLiMulansMother.strength + 1);
//     expect(character.willpower).toEqual(faLiMulansMother.willpower + 1);
//     expect(anotherChar.strength).toEqual(
//       minnieMouseBelovedPrincess.strength + 1,
//     );
//     expect(anotherChar.willpower).toEqual(
//       minnieMouseBelovedPrincess.willpower + 1,
//     );
//
//     const defender = testStore.getCard(mickeyMouseWaywardSorcerer);
//     defender.updateCardMeta({ exerted: true });
//
//     anotherChar.challenge(defender);
//
//     expect(defender.meta.damage).toBe(minnieMouseBelovedPrincess.strength + 1);
//     expect(anotherChar.meta.damage).toBe(mickeyMouseWaywardSorcerer.strength);
//   });
//
//   it("Doesn't give the bonus to itself", () => {
//     const testStore = new TestStore({
//       play: [hiddenCoveTranquilHaven],
//     });
//
//     const location = testStore.getCard(hiddenCoveTranquilHaven);
//
//     expect(location.willpower).toBe(hiddenCoveTranquilHaven.willpower);
//     expect(location.strength).toBe(hiddenCoveTranquilHaven.strength || 0);
//   });
// });
//
