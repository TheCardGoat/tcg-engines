// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DrFacilierFortuneTeller,
//   GoofyKnightForADay,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Dr. Facilier - Fortune Teller", () => {
//   It("**YOU'RE IN MY WORLD** Whenever this character quests, chosen opposing character can't quest during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [drFacilierFortuneTeller],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DrFacilierFortuneTeller.id,
//     );
//
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     CardUnderTest.quest();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasQuestRestriction).toEqual(true);
//   });
//
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [drFacilierFortuneTeller],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       DrFacilierFortuneTeller.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
// });
//
