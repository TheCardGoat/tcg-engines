// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseWaywardSorcerer,
//   MinnieMouseBelovedPrincess,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { faLiMulansMother } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hidden Cove - Tranquil Haven", () => {
//   It("**REVITALIZING WATERS** Characters get +1 {S} and +1 {W}️ while here.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: hiddenCoveTranquilHaven.moveCost * 2,
//         Play: [
//           HiddenCoveTranquilHaven,
//           FaLiMulansMother,
//           MinnieMouseBelovedPrincess,
//         ],
//         Deck: 2,
//       },
//       {
//         Play: [mickeyMouseWaywardSorcerer],
//       },
//     );
//
//     Const character = testStore.getCard(faLiMulansMother);
//     Const anotherChar = testStore.getCard(minnieMouseBelovedPrincess);
//     Const location = testStore.getCard(hiddenCoveTranquilHaven);
//
//     Expect(character.strength).toEqual(faLiMulansMother.strength);
//     Expect(character.willpower).toEqual(faLiMulansMother.willpower);
//
//     Character.enterLocation(location);
//     AnotherChar.enterLocation(location);
//
//     Expect(character.strength).toEqual(faLiMulansMother.strength + 1);
//     Expect(character.willpower).toEqual(faLiMulansMother.willpower + 1);
//     Expect(anotherChar.strength).toEqual(
//       MinnieMouseBelovedPrincess.strength + 1,
//     );
//     Expect(anotherChar.willpower).toEqual(
//       MinnieMouseBelovedPrincess.willpower + 1,
//     );
//
//     Const defender = testStore.getCard(mickeyMouseWaywardSorcerer);
//     Defender.updateCardMeta({ exerted: true });
//
//     AnotherChar.challenge(defender);
//
//     Expect(defender.meta.damage).toBe(minnieMouseBelovedPrincess.strength + 1);
//     Expect(anotherChar.meta.damage).toBe(mickeyMouseWaywardSorcerer.strength);
//   });
//
//   It("Doesn't give the bonus to itself", () => {
//     Const testStore = new TestStore({
//       Play: [hiddenCoveTranquilHaven],
//     });
//
//     Const location = testStore.getCard(hiddenCoveTranquilHaven);
//
//     Expect(location.willpower).toBe(hiddenCoveTranquilHaven.willpower);
//     Expect(location.strength).toBe(hiddenCoveTranquilHaven.strength || 0);
//   });
// });
//
