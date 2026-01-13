import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { suddenChill } from "./098-sudden-chill";

describe("Sudden Chill - undefined", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [suddenChill] });
  //   expect(testEngine.getCardModel(suddenChill).hasKeyword()).toBe(true);
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
// import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Sudden Chill", () => {
//   it("Each opponent chooses and discards a card", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: suddenChill.cost,
//         hand: [suddenChill],
//       },
//       { hand: [moanaOfMotunui] },
//     );
//
//     const cardUnderTest = testStore.getCard(suddenChill);
//     const target = testStore.getCard(moanaOfMotunui);
//
//     cardUnderTest.playFromHand();
//
//     testStore.changePlayer("player_two");
//
//     testStore.resolveTopOfStack({
//       targets: [target],
//     });
//
//     expect(target.zone).toEqual("discard");
//   });
// });
//
