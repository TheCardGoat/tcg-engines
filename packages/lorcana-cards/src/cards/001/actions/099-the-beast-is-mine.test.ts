import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { theBeastIsMine } from "./099-the-beast-is-mine";

describe("The Beast is Mine! - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [theBeastIsMine] });
  //   Expect(testEngine.getCardModel(theBeastIsMine).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import { theBeastIsMine } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Beast is Mine!", () => {
//   It("Chosen character gains **Reckless** during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: theBeastIsMine.cost,
//         Hand: [theBeastIsMine],
//         Play: [moanaOfMotunui],
//       },
//       {
//         Deck: 1,
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", theBeastIsMine.id);
//     Const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.hasReckless).toEqual(false);
//
//     TestStore.store.passTurn(testStore.store.turnPlayer);
//
//     Expect(target.hasReckless).toEqual(true);
//   });
// });
//
