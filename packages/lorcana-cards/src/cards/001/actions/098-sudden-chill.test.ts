import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { suddenChill } from "./098-sudden-chill";

describe("Sudden Chill - undefined", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [suddenChill] });
  //   Expect(testEngine.getCardModel(suddenChill).hasKeyword()).toBe(true);
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
// Import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Sudden Chill", () => {
//   It("Each opponent chooses and discards a card", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: suddenChill.cost,
//         Hand: [suddenChill],
//       },
//       { hand: [moanaOfMotunui] },
//     );
//
//     Const cardUnderTest = testStore.getCard(suddenChill);
//     Const target = testStore.getCard(moanaOfMotunui);
//
//     CardUnderTest.playFromHand();
//
//     TestStore.changePlayer("player_two");
//
//     TestStore.resolveTopOfStack({
//       Targets: [target],
//     });
//
//     Expect(target.zone).toEqual("discard");
//   });
// });
//
