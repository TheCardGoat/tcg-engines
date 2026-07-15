// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PeterPanFearless,
//   PeterPanNeverLanding,
//   TinkerBellPeterPan,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { peterPansShadowNotSewnOn } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Peter Pan's Ally", () => {
//   It("Evasive", () => {
//     Const testStore = new TestStore({
//       Play: [tinkerBellPeterPan],
//     });
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TinkerBellPeterPan.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//   });
//
//   It("**LOYAL AND DEVOTED** Your characters named Peter Pan gain **Challenger +1.** _(They get +1 {S} while challenging.)_", () => {
//     Const testStore = new TestStore({
//       Play: [
//         TinkerBellPeterPan,
//         PeterPanFearless,
//         PeterPanNeverLanding,
//         PeterPansShadowNotSewnOn,
//       ],
//     });
//
//     Const peterOne = testStore.getByZoneAndId("play", peterPanFearless.id);
//     Const peterTwo = testStore.getByZoneAndId("play", peterPanNeverLanding.id);
//     Const notPeter = testStore.getByZoneAndId(
//       "play",
//       PeterPansShadowNotSewnOn.id,
//     );
//
//     Expect(notPeter.hasChallenger).toEqual(false);
//     [peterOne, peterTwo].forEach((peter) => {
//       Expect(peter.hasChallenger).toEqual(true);
//     });
//   });
// });
//
