// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { worldsGreatestCriminalMind } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   GoofyKnightForADay,
//   PachaVillageLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("World's Greatest Criminal Mind", () => {
//   It("Banish chosen character with 5 {S} or more.", () => {
//     Const testStore = new TestStore({
//       Inkwell: worldsGreatestCriminalMind.cost,
//       Hand: [worldsGreatestCriminalMind],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       WorldsGreatestCriminalMind.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("discard");
//   });
//
//   It("Can't banish  character with less than 5 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: worldsGreatestCriminalMind.cost,
//       Hand: [worldsGreatestCriminalMind],
//       Play: [pachaVillageLeader],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       WorldsGreatestCriminalMind.id,
//     );
//     Const target = testStore.getByZoneAndId("play", pachaVillageLeader.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toEqual("play");
//   });
// });
//
