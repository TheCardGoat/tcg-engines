// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MulanSoldierInTraining,
//   PeterPansShadowNotSewnOn,
//   QueenOfHeartsImpulsiveRuler,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Peter Pan's Shadow - Not Sewn On", () => {
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [peterPansShadowNotSewnOn],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPansShadowNotSewnOn.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   It("Rush", () => {
//     Const testStore = new TestStore({
//       Play: [peterPansShadowNotSewnOn],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPansShadowNotSewnOn.id,
//     );
//
//     Expect(cardUnderTest.hasRush).toEqual(true);
//   });
//
//   It("**TIPTOE** Your other characters with **Rush** gain **Evasive**.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         PeterPansShadowNotSewnOn,
//         MulanSoldierInTraining,
//         QueenOfHeartsImpulsiveRuler,
//       ],
//     });
//
//     Const target = testStore.getByZoneAndId("play", mulanSoldierInTraining.id);
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       QueenOfHeartsImpulsiveRuler.id,
//     );
//
//     Expect(target2.hasEvasive).toEqual(true);
//     Expect(target.hasEvasive).toEqual(true);
//   });
// });
//
