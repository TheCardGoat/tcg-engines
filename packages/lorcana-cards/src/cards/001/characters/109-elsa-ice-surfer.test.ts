import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { elsaIceSurfer } from "./109-elsa-ice-surfer";

describe("Elsa - Ice Surfer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [elsaIceSurfer] });
  //   Expect(testEngine.getCardModel(elsaIceSurfer).hasKeyword()).toBe(true);
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
//   AnnaHeirToArendelle,
//   ElsaIceSurfer,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa Ice Surfer", () => {
//   It("THAT'S NO BLIZZARD effect - Whenever you play a character named Anna, ready this character. This character can't quest for the rest of this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: annaHeirToArendelle.cost,
//       Play: [elsaIceSurfer],
//       Hand: [annaHeirToArendelle],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", elsaIceSurfer.id);
//     Const targetTrigger = testStore.getByZoneAndId(
//       "hand",
//       AnnaHeirToArendelle.id,
//     );
//     CardUnderTest.updateCardMeta({ exerted: true });
//
//     TargetTrigger.playFromHand();
//
//     Expect(cardUnderTest.meta).toEqual(
//       Expect.objectContaining({ exerted: false }),
//     );
//   });
// });
//
