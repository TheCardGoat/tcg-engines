import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { ifItsNotBaroque } from "./162-if-its-not-baroque";

describe("If It - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [ifItsNotBaroque] });
  //   expect(testEngine.getCardModel(ifItsNotBaroque).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ifItsNotBaroque } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { shieldOfVirtue } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("If it's Not Baroque", () => {
//   it("Return item from discard.", () => {
//     const testStore = new TestStore({
//       inkwell: ifItsNotBaroque.cost,
//       hand: [ifItsNotBaroque],
//       discard: [shieldOfVirtue],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", ifItsNotBaroque.id);
//     const target = testStore.getByZoneAndId("discard", shieldOfVirtue.id);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("hand");
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({ hand: 1, deck: 0, discard: 1, play: 0 }),
//     );
//   });
// });
//
