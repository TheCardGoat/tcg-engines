import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { genieOnTheJob } from "./075-genie-on-the-job";

describe("Genie - On the Job", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [genieOnTheJob] });
  //   Expect(testEngine.getCardModel(genieOnTheJob).hasKeyword()).toBe(true);
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
//   GenieOnTheJob,
//   ScarShamelessFirebrand,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { eyeOfTheFate } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Genie On The Job", () => {
//   It("DISAPPEAR effect - returning own character", () => {
//     Const testStore = new TestStore({
//       Inkwell: genieOnTheJob.cost,
//       Hand: [genieOnTheJob],
//       Play: [scarShamelessFirebrand],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", genieOnTheJob.id);
//     Const target = testStore.getByZoneAndId("play", scarShamelessFirebrand.id);
//     Expect(target.zone).toEqual("play");
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 1 }),
//     );
//   });
//
//   It("DISAPPEAR effect - returning opponents character", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: genieOnTheJob.cost,
//         Hand: [genieOnTheJob],
//       },
//       {
//         Play: [scarShamelessFirebrand],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", genieOnTheJob.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       ScarShamelessFirebrand.id,
//       "player_two",
//     );
//     Expect(target.zone).toEqual("play");
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 0 }),
//     );
//   });
//
//   It.skip("DISAPPEAR effect - no valid target", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: genieOnTheJob.cost,
//         Hand: [genieOnTheJob],
//         Play: [eyeOfTheFate],
//       },
//       {
//         Play: [eyeOfTheFate],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", genieOnTheJob.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, discard: 0, play: 2 }),
//     );
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 0, deck: 0, discard: 0, play: 1 }),
//     );
//   });
// });
//
