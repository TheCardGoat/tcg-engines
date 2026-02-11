// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DrFacilierSavvyOpportunist,
//   JafarRoyalVizier,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { peterPansDagger } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Peter Pan's Dagger", () => {
//   It("[Native ability] Your characters with **Evasive** get +1 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [peterPansDagger, drFacilierSavvyOpportunist],
//     });
//
//     Const target2 = testStore.getByZoneAndId(
//       "play",
//       DrFacilierSavvyOpportunist.id,
//     );
//
//     [target2].forEach((card) => {
//       Expect(card.hasEvasive).toEqual(true);
//       Expect(card.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
//     });
//   });
//
//   It("[Gained ability] Your characters with **Evasive** get +1 {S}.", () => {
//     Const testStore = new TestStore({
//       Play: [peterPansDagger, jafarRoyalVizier],
//     });
//
//     Const target = testStore.getByZoneAndId("play", jafarRoyalVizier.id);
//
//     [target].forEach((card) => {
//       Expect(card.hasEvasive).toEqual(true);
//       Expect(target.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
//     });
//   });
// });
//
