import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { scarShamelessFirebrand } from "./123-scar-shameless-firebrand";

describe("Scar - Shameless Firebrand", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [scarShamelessFirebrand] });
  //   Expect(testEngine.getCardModel(scarShamelessFirebrand).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ChiefTui,
//   DrFacilierCharlatan,
//   HerculesTrueHero,
//   ScarShamelessFirebrand,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Scar Shameless Firebrand", () => {
//   It("ROUSING SPEECH effect- Ready All characters with cost 3 or less", () => {
//     Const testStore = new TestStore({
//       Inkwell: scarShamelessFirebrand.cost,
//       Play: [herculesTrueHero, stichtNewDog, drFacilierCharlatan],
//       Hand: [scarShamelessFirebrand],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       ScarShamelessFirebrand.id,
//     );
//     Const oneCostTarget = testStore.getByZoneAndId("play", herculesTrueHero.id);
//     Const twoCostTarget = testStore.getByZoneAndId("play", stichtNewDog.id);
//     Const threeCostTarget = testStore.getByZoneAndId(
//       "play",
//       DrFacilierCharlatan.id,
//     );
//     OneCostTarget.updateCardMeta({ exerted: true });
//     TwoCostTarget.updateCardMeta({ exerted: true });
//     ThreeCostTarget.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getByZoneAndId("play", herculesTrueHero.id).meta).toEqual(
//       Expect.objectContaining({ exerted: false }),
//     );
//     Expect(testStore.getByZoneAndId("play", stichtNewDog.id).meta).toEqual(
//       Expect.objectContaining({ exerted: false }),
//     );
//     Expect(
//       TestStore.getByZoneAndId("play", drFacilierCharlatan.id).meta,
//     ).toEqual(expect.objectContaining({ exerted: false }));
//   });
//
//   It("ROUSING SPEECH effect- Should Not Ready All characters with cost greater than 3", () => {
//     Const testStore = new TestStore({
//       Inkwell: scarShamelessFirebrand.cost,
//       Play: [chiefTui],
//       Hand: [scarShamelessFirebrand],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       ScarShamelessFirebrand.id,
//     );
//     Const target = testStore.getByZoneAndId("play", chiefTui.id);
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//
//     Expect(testStore.getByZoneAndId("play", chiefTui.id).meta).toEqual(
//       Expect.objectContaining({ exerted: true }),
//     );
//   });
// });
//
