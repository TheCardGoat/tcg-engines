// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomTheBigSweeper } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { aladdinResoluteSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - The Big Sweeper", () => {
//   It("**CLEAN SWEEP** While this character is at a location, it gets +2 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: magicBroomTheBigSweeper.cost,
//       Play: [
//         MagicBroomTheBigSweeper,
//         ForbiddenMountainMaleficentsCastle,
//         AladdinResoluteSwordsman,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(magicBroomTheBigSweeper);
//     Const location = testStore.getCard(forbiddenMountainMaleficentsCastle);
//     Const anotherCard = testStore.getCard(aladdinResoluteSwordsman);
//
//     Expect(cardUnderTest.strength).toEqual(magicBroomTheBigSweeper.strength);
//     Expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);
//     CardUnderTest.enterLocation(location);
//     Expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);
//
//     Expect(cardUnderTest.strength).toEqual(
//       MagicBroomTheBigSweeper.strength + 2,
//     );
//   });
// });
//
