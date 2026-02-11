// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { miloThatchSpiritedScholar } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Milo Thatch - Spirited Scholar", () => {
//   It("**I’M YOUR MAN!** While this character is at a location, he gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: miloThatchSpiritedScholar.cost,
//       Play: [miloThatchSpiritedScholar, forbiddenMountainMaleficentsCastle],
//     });
//
//     Const cardUnderTest = testStore.getCard(miloThatchSpiritedScholar);
//     Const location = testStore.getCard(forbiddenMountainMaleficentsCastle);
//
//     Expect(cardUnderTest.strength).toEqual(miloThatchSpiritedScholar.strength);
//     CardUnderTest.enterLocation(location);
//     Expect(cardUnderTest.strength).toEqual(
//       MiloThatchSpiritedScholar.strength + 2,
//     );
//   });
// });
//
