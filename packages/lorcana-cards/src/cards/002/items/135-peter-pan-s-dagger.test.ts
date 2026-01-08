// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   drFacilierSavvyOpportunist,
//   jafarRoyalVizier,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { peterPansDagger } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Peter Pan's Dagger", () => {
//   it("[Native ability] Your characters with **Evasive** get +1 {S}.", () => {
//     const testStore = new TestStore({
//       play: [peterPansDagger, drFacilierSavvyOpportunist],
//     });
//
//     const target2 = testStore.getByZoneAndId(
//       "play",
//       drFacilierSavvyOpportunist.id,
//     );
//
//     [target2].forEach((card) => {
//       expect(card.hasEvasive).toEqual(true);
//       expect(card.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
//     });
//   });
//
//   it("[Gained ability] Your characters with **Evasive** get +1 {S}.", () => {
//     const testStore = new TestStore({
//       play: [peterPansDagger, jafarRoyalVizier],
//     });
//
//     const target = testStore.getByZoneAndId("play", jafarRoyalVizier.id);
//
//     [target].forEach((card) => {
//       expect(card.hasEvasive).toEqual(true);
//       expect(target.strength).toEqual((card.lorcanitoCard?.strength || 0) + 1);
//     });
//   });
// });
//
