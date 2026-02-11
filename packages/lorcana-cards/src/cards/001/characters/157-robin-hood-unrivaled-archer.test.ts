import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { robinHoodUnrivaledArcher } from "./157-robin-hood-unrivaled-archer";

describe("Robin Hood - Unrivaled Archer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [robinHoodUnrivaledArcher] });
  //   Expect(testEngine.getCardModel(robinHoodUnrivaledArcher).hasKeyword()).toBe(true);
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
//   Ransack,
//   YouHaveForgottenMe,
// } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   MagicBroomBucketBrigade,
//   RobinHoodUnrivaledArcher,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood - Unrivaled Archer", () => {
//   Describe("Good Shot: During your turn, this character gains **Evasive**.", () => {
//     It("During your turn.", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [robinHoodUnrivaledArcher],
//         },
//         {
//           Play: [robinHoodUnrivaledArcher],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         RobinHoodUnrivaledArcher.id,
//       );
//
//       Expect(cardUnderTest.hasEvasive).toBeTruthy();
//     });
//
//     It("During opponent's turn.", () => {
//       Const testStore = new TestStore(
//         {},
//         {
//           Play: [robinHoodUnrivaledArcher],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         RobinHoodUnrivaledArcher.id,
//         "player_two",
//       );
//
//       Expect(cardUnderTest.hasEvasive).toBeFalsy();
//     });
//   });
//
//   Describe("Feed the Poor - When you play this character, if an opponent has more cards in their hand than you, draw a card.", () => {
//     It("Player has less cards than opponent", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 1,
//           Inkwell: robinHoodUnrivaledArcher.cost,
//           Hand: [robinHoodUnrivaledArcher, ransack],
//         },
//         {
//           Hand: [magicBroomBucketBrigade, youHaveForgottenMe],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         RobinHoodUnrivaledArcher.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1 + 1, deck: 0, play: 1 }),
//       );
//     });
//
//     It("Player has more cards than opponent", () => {
//       Const testStore = new TestStore({
//         Deck: 1,
//         Inkwell: robinHoodUnrivaledArcher.cost,
//         Hand: [robinHoodUnrivaledArcher, ransack],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         RobinHoodUnrivaledArcher.id,
//       );
//
//       CardUnderTest.playFromHand();
//
//       Expect(testStore.getZonesCardCount()).toEqual(
//         Expect.objectContaining({ hand: 1, deck: 1, play: 1 }),
//       );
//     });
//   });
// });
//
