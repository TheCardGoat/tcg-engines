import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { elsaIceSurfer } from "./109-elsa-ice-surfer";

describe("Elsa - Ice Surfer", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [elsaIceSurfer] });
  //   expect(testEngine.getCardModel(elsaIceSurfer).hasKeyword()).toBe(true);
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
//   annaHeirToArendelle,
//   elsaIceSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Elsa Ice Surfer", () => {
//   it("THAT'S NO BLIZZARD effect - Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.", () => {
//     const testStore = new TestStore({
//       inkwell: annaHeirToArendelle.cost,
//       play: [elsaIceSurfer],
//       hand: [annaHeirToArendelle],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", elsaIceSurfer.id);
//     const targetTrigger = testStore.getByZoneAndId(
//       "hand",
//       annaHeirToArendelle.id,
//     );
//     cardUnderTest.updateCardMeta({ exerted: true });
//
//     targetTrigger.playFromHand();
//
//     expect(cardUnderTest.meta).toEqual(
//       expect.objectContaining({ exerted: false }),
//     );
//   });
// });
//
