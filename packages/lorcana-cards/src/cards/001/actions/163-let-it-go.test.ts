import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { letItGo } from "./163-let-it-go";

describe("Let It Go - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [letItGo] });
  //   Expect(testEngine.getCardModel(letItGo).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Let it Go", () => {
//   It("Adds your own char to inkwell", () => {
//     Const testStore = new TestStore({
//       Inkwell: letItGo.cost,
//       Hand: [letItGo],
//       Play: [moanaOfMotunui],
//     });
//     Const store = testStore.store;
//     Const tableStore = store.tableStore;
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(
//       TableStore.getPlayerZone("player_one", "inkwell")?.cards,
//     ).toHaveLength(letItGo.cost + 1);
//     Expect(target.zone).toEqual("inkwell");
//     Expect(target.ready).toBeFalsy();
//   });
//
//   It("Adds opponent's char to inkwell", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: letItGo.cost,
//         Hand: [letItGo],
//       },
//       {
//         Play: [moanaOfMotunui],
//       },
//     );
//     Const store = testStore.store;
//     Const tableStore = store.tableStore;
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MoanaOfMotunui.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({
//       TargetId: target.instanceId,
//     });
//
//     Expect(
//       TableStore.getPlayerZone("player_two", "inkwell")?.cards,
//     ).toHaveLength(1);
//     Expect(target.zone).toEqual("inkwell");
//     Expect(target.ready).toBeFalsy();
//   });
// });
//
