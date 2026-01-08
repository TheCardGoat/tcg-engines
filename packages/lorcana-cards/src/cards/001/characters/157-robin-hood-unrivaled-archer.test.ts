import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { robinHoodUnrivaledArcher } from "./157-robin-hood-unrivaled-archer";

describe("Robin Hood - Unrivaled Archer", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [robinHoodUnrivaledArcher] });
  //   expect(testEngine.getCardModel(robinHoodUnrivaledArcher).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   ransack,
//   youHaveForgottenMe,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// import {
//   magicBroomBucketBrigade,
//   robinHoodUnrivaledArcher,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Robin Hood - Unrivaled Archer", () => {
//   describe("Good Shot: During your turn, this character gains **Evasive**.", () => {
//     it("During your turn.", () => {
//       const testStore = new TestStore(
//         {
//           play: [robinHoodUnrivaledArcher],
//         },
//         {
//           play: [robinHoodUnrivaledArcher],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         robinHoodUnrivaledArcher.id,
//       );
//
//       expect(cardUnderTest.hasEvasive).toBeTruthy();
//     });
//
//     it("During opponent's turn.", () => {
//       const testStore = new TestStore(
//         {},
//         {
//           play: [robinHoodUnrivaledArcher],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         robinHoodUnrivaledArcher.id,
//         "player_two",
//       );
//
//       expect(cardUnderTest.hasEvasive).toBeFalsy();
//     });
//   });
//
//   describe("Feed the Poor - When you play this character, if an opponent has more cards in their hand than you, draw a card.", () => {
//     it("Player has less cards than opponent", () => {
//       const testStore = new TestStore(
//         {
//           deck: 1,
//           inkwell: robinHoodUnrivaledArcher.cost,
//           hand: [robinHoodUnrivaledArcher, ransack],
//         },
//         {
//           hand: [magicBroomBucketBrigade, youHaveForgottenMe],
//         },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         robinHoodUnrivaledArcher.id,
//       );
//
//       cardUnderTest.playFromHand();
//
//       expect(testStore.getZonesCardCount()).toEqual(
//         expect.objectContaining({ hand: 1 + 1, deck: 0, play: 1 }),
//       );
//     });
//
//     it("Player has more cards than opponent", () => {
//       const testStore = new TestStore({
//         deck: 1,
//         inkwell: robinHoodUnrivaledArcher.cost,
//         hand: [robinHoodUnrivaledArcher, ransack],
//       });
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         robinHoodUnrivaledArcher.id,
//       );
//
//       cardUnderTest.playFromHand();
//
//       expect(testStore.getZonesCardCount()).toEqual(
//         expect.objectContaining({ hand: 1, deck: 1, play: 1 }),
//       );
//     });
//   });
// });
//
