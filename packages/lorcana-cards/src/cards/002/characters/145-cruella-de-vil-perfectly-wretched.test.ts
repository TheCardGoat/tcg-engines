// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { cruellaDeVilPerfectlyWretched } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cruella De Vil - Perfectly Wretched", () => {
//   It("**OH, NO YOU DON'T** Whenever this character quests, chosen opposing character gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [cruellaDeVilPerfectlyWretched],
//       },
//       {
//         Play: [mickeyMouseTrueFriend],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CruellaDeVilPerfectlyWretched.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseTrueFriend.id,
//       "player_two",
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
//   });
//
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [cruellaDeVilPerfectlyWretched],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CruellaDeVilPerfectlyWretched.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
