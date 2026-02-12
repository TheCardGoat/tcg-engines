import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { befuddle } from "./062-befuddle";

describe("Befuddle - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [befuddle] });
  //   Expect(testEngine.getCardModel(befuddle).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { befuddle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { simbaProtectiveCub } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Befuddle", () => {
//   It("Return an opponent character with cost 2.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: befuddle.cost,
//         Hand: [befuddle],
//       },
//       {
//         Play: [simbaProtectiveCub],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       SimbaProtectiveCub.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 0, play: 0 }),
//     );
//   });
//
//   It("Return self character with cost 2.", () => {
//     Const testStore = new TestStore({
//       Inkwell: befuddle.cost,
//       Hand: [befuddle],
//       Play: [simbaProtectiveCub],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
//     Const target = testStore.getByZoneAndId("play", simbaProtectiveCub.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
//     );
//   });
//
//   It("Return an opponent item with cost 2.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: befuddle.cost,
//         Hand: [befuddle],
//       },
//       {
//         Play: [shieldOfVirtue],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       ShieldOfVirtue.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//
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
//   It("Return self item with cost 2.", () => {
//     Const testStore = new TestStore({
//       Inkwell: befuddle.cost,
//       Hand: [befuddle],
//       Play: [shieldOfVirtue],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", befuddle.id);
//     Const target = testStore.getByZoneAndId("play", shieldOfVirtue.id);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(target.zone).toEqual("hand");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
//     );
//   });
// });
//
