import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { arielWhoseitCollector } from "./137-ariel-whoseit-collector";

describe("Ariel - Whoseit Collector", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [arielWhoseitCollector] });
  //   Expect(testEngine.getCardModel(arielWhoseitCollector).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielWhoseitCollector } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   Coconutbasket,
//   Lantern,
// } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel - Whoseit Collector", () => {
//   Describe("**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.", () => {
//     It("should ready when an item is played", () => {
//       Const testStore = new TestStore({
//         Inkwell: lantern.cost + coconutbasket.cost,
//         Hand: [coconutbasket, lantern],
//         Play: [arielWhoseitCollector],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ArielWhoseitCollector.id,
//       );
//       Const target = testStore.getByZoneAndId("hand", coconutbasket.id);
//       Const _anotherTarget = testStore.getByZoneAndId("hand", lantern.id);
//
//       CardUnderTest.quest();
//       Expect(cardUnderTest.ready).toBeFalsy();
//
//       Target.playFromHand();
//       TestStore.resolveTopOfStack();
//       Expect(cardUnderTest.ready).toBeTruthy();
//
//       CardUnderTest.quest();
//       Expect(cardUnderTest.ready).toBeFalsy();
//
//       _anotherTarget.playFromHand();
//       TestStore.resolveTopOfStack();
//       Expect(cardUnderTest.ready).toBeTruthy();
//     });
//
//     It("should NOT ready when an opponent play an item", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: lantern.cost + coconutbasket.cost,
//           Hand: [coconutbasket, lantern],
//         },
//         {
//           Play: [arielWhoseitCollector],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         ArielWhoseitCollector.id,
//         "player_two",
//       );
//       Const target = testStore.getByZoneAndId("hand", coconutbasket.id);
//
//       CardUnderTest.quest();
//       Expect(cardUnderTest.ready).toBeFalsy();
//
//       Target.playFromHand();
//       Expect(cardUnderTest.ready).toBeFalsy();
//       Expect(testStore.store.stackLayerStore.layers.length).toBe(0);
//     });
//   });
// });
//
