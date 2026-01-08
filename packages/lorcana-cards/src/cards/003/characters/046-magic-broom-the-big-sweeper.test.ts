// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { magicBroomTheBigSweeper } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// import { aladdinResoluteSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Magic Broom - The Big Sweeper", () => {
//   it("**CLEAN SWEEP** While this character is at a location, it gets +2 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: magicBroomTheBigSweeper.cost,
//       play: [
//         magicBroomTheBigSweeper,
//         forbiddenMountainMaleficentsCastle,
//         aladdinResoluteSwordsman,
//       ],
//     });
//
//     const cardUnderTest = testStore.getCard(magicBroomTheBigSweeper);
//     const location = testStore.getCard(forbiddenMountainMaleficentsCastle);
//     const anotherCard = testStore.getCard(aladdinResoluteSwordsman);
//
//     expect(cardUnderTest.strength).toEqual(magicBroomTheBigSweeper.strength);
//     expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);
//     cardUnderTest.enterLocation(location);
//     expect(anotherCard.strength).toEqual(aladdinResoluteSwordsman.strength);
//
//     expect(cardUnderTest.strength).toEqual(
//       magicBroomTheBigSweeper.strength + 2,
//     );
//   });
// });
//
