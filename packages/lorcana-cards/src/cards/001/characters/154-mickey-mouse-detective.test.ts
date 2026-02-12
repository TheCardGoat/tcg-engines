import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { mickeyMouseDetective } from "./154-mickey-mouse-detective";

describe("Mickey Mouse - Detective", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [mickeyMouseDetective] });
  //   Expect(testEngine.getCardModel(mickeyMouseDetective).hasKeyword()).toBe(true);
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
//   MauriceWorldFamousInventor,
//   MickeyMouseDetective,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Detective", () => {
//   It("**GET A CLUE** When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mickeyMouseDetective.cost,
//       Deck: [mauriceWorldFamousInventor],
//       Hand: [mickeyMouseDetective],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MickeyMouseDetective.id,
//     );
//
//     Const topDeckCard = testStore.getByZoneAndId(
//       "deck",
//       MauriceWorldFamousInventor.id,
//     );
//
//     CardUnderTest.playFromHand();
//
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({ targets: [topDeckCard] });
//
//     Expect(topDeckCard.zone).toEqual("inkwell");
//     Expect(topDeckCard.ready).toEqual(false);
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
