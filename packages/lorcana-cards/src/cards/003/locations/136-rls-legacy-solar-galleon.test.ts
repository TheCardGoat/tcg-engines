// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   LiloMakingAWish,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rlsLegacySolarGalleon } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("RLS Legacy - Solar Galleon", () => {
//   It("**THIS IS OUR SHIP** Characters gain **Evasive** while here. _(Only characters with Evasive can challenge them.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: rlsLegacySolarGalleon.moveCost,
//       Play: [rlsLegacySolarGalleon, liloMakingAWish],
//     });
//
//     Const cardUnderTest = testStore.getCard(rlsLegacySolarGalleon);
//     Const lilo = testStore.getCard(liloMakingAWish);
//
//     Expect(lilo.hasEvasive).toBe(false);
//
//     Lilo.enterLocation(cardUnderTest);
//
//     Expect(lilo.hasEvasive).toBe(true);
//   });
//
//   It("**HEAVE TOGETHER NOW** If you have a character here, you pay 2 {I} less to move a character of yours here.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rlsLegacySolarGalleon.moveCost + 1,
//       Play: [rlsLegacySolarGalleon, liloMakingAWish, stichtNewDog],
//     });
//
//     Const cardUnderTest = testStore.getCard(rlsLegacySolarGalleon);
//     Const lilo = testStore.getCard(liloMakingAWish);
//     Const sticht = testStore.getCard(stichtNewDog);
//
//     Expect(cardUnderTest.moveCost).toBe(rlsLegacySolarGalleon.moveCost);
//
//     Lilo.enterLocation(cardUnderTest);
//     Sticht.enterLocation(cardUnderTest);
//
//     Expect(lilo.isAtLocation(cardUnderTest)).toBe(true);
//     Expect(cardUnderTest.moveCost).toBe(rlsLegacySolarGalleon.moveCost - 2);
//     Expect(sticht.isAtLocation(cardUnderTest)).toBe(true);
//   });
// });
//
