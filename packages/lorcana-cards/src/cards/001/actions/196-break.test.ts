import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { breakCard } from "./196-break";

describe("breakCard - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [breakAction] });
  //   expect(testEngine.getCardModel(breakAction).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { breakAction } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Break", () => {
//   it("Banish chosen item.", () => {
//     const testStore = new TestStore({
//       inkwell: breakAction.cost,
//       hand: [breakAction],
//       play: [dingleHopper],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", breakAction.id);
//     const target = testStore.getByZoneAndId("play", dingleHopper.id);
//
//     cardUnderTest.playFromHand();
//
//     testStore.resolveTopOfStack({
//       targetId: target.instanceId,
//     });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
