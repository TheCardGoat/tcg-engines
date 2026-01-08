import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { letItGo } from "./163-let-it-go";

describe("Let It Go - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [letItGo] });
  //   expect(testEngine.getCardModel(letItGo).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { letItGo } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Let it Go", () => {
//   it("Adds your own char to inkwell", () => {
//     const testStore = new TestStore({
//       inkwell: letItGo.cost,
//       hand: [letItGo],
//       play: [moanaOfMotunui],
//     });
//     const store = testStore.store;
//     const tableStore = store.tableStore;
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
//     const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       targets: [target],
//     });
//
//     expect(
//       tableStore.getPlayerZone("player_one", "inkwell")?.cards,
//     ).toHaveLength(letItGo.cost + 1);
//     expect(target.zone).toEqual("inkwell");
//     expect(target.ready).toBeFalsy();
//   });
//
//   it("Adds opponent's char to inkwell", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: letItGo.cost,
//         hand: [letItGo],
//       },
//       {
//         play: [moanaOfMotunui],
//       },
//     );
//     const store = testStore.store;
//     const tableStore = store.tableStore;
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", letItGo.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       moanaOfMotunui.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(
//       tableStore.getPlayerZone("player_two", "inkwell")?.cards,
//     ).toHaveLength(1);
//     expect(target.zone).toEqual("inkwell");
//     expect(target.ready).toBeFalsy();
//   });
// });
//
