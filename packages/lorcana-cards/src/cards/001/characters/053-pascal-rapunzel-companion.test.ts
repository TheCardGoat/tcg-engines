// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   PascalRapunzelCompanion,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pascal - Rapunzel's Companion", () => {
//   Describe("**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_", () => {
//     It("Alone in the battlefield", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [pascalRapunzelCompanion],
//         },
//         {
//           Play: [mickeyBraveLittleTailor],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         PascalRapunzelCompanion.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toEqual(false);
//     });
//
//     It("With another characters in play", () => {
//       Const testStore = new TestStore({
//         Play: [pascalRapunzelCompanion, rapunzelGiftedWithHealing],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         PascalRapunzelCompanion.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toEqual(true);
//     });
//   });
// });
//
