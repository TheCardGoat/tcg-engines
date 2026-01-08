// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyBraveLittleTailor,
//   pascalRapunzelCompanion,
//   rapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Pascal - Rapunzel's Companion", () => {
//   describe("**CAMOUFLAGE** While you have another character in play, this character gains **Evasive**. _(Only characters\rwith Evasive can challenge them.)_", () => {
//     it("Alone in the battlefield", () => {
//       const testStore = new TestStore(
//         {
//           play: [pascalRapunzelCompanion],
//         },
//         {
//           play: [mickeyBraveLittleTailor],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         pascalRapunzelCompanion.id,
//       );
//
//       expect(cardUnderTest.hasEvasive).toEqual(false);
//     });
//
//     it("With another characters in play", () => {
//       const testStore = new TestStore({
//         play: [pascalRapunzelCompanion, rapunzelGiftedWithHealing],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         pascalRapunzelCompanion.id,
//       );
//
//       expect(cardUnderTest.hasEvasive).toEqual(true);
//     });
//   });
// });
//
