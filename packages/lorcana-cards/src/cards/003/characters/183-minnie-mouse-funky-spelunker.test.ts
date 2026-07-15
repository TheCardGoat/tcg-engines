// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { minnieMouseFunkySpelunker } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Minnie Mouse - Funky Spelunker", () => {
//   It("**JOURNEY** While this character is at a location, she gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: forbiddenMountainMaleficentsCastle.moveCost,
//       Play: [minnieMouseFunkySpelunker, forbiddenMountainMaleficentsCastle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MinnieMouseFunkySpelunker.id,
//     );
//     Const location = testStore.getByZoneAndId(
//       "play",
//       ForbiddenMountainMaleficentsCastle.id,
//     );
//
//     Expect(cardUnderTest.strength).toEqual(minnieMouseFunkySpelunker.strength);
//     CardUnderTest.enterLocation(location);
//     Expect(cardUnderTest.strength).toEqual(
//       MinnieMouseFunkySpelunker.strength + 2,
//     );
//   });
// });
//
