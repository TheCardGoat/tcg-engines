import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { tinkerBellTinyTactician } from "./194-tinker-bell-tiny-tactician";

describe("Tinker Bell - Tiny Tactician", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [tinkerBellTinyTactician] });
  //   Expect(testEngine.getCardModel(tinkerBellTinyTactician).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { youHaveForgottenMe } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
// Import {
//   AladdinHeroicOutlaw,
//   MagicBroomBucketBrigade,
//   SimbaFutureKing,
//   TinkerBellTinyTactician,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tinker Bell - Tiny Tactician", () => {
//   It("**Battle plans** {E} - Draw a card, then choose and discard a card.", () => {
//     Const testStore = new TestStore({
//       Deck: [magicBroomBucketBrigade, youHaveForgottenMe],
//       Play: [tinkerBellTinyTactician],
//       Hand: [simbaFutureKing, aladdinHeroicOutlaw],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TinkerBellTinyTactician.id,
//     );
//
//     Const aCardToDiscard = testStore.getByZoneAndId(
//       "hand",
//       AladdinHeroicOutlaw.id,
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({
//       Targets: [aCardToDiscard],
//     });
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ hand: 2, deck: 1, play: 1, discard: 1 }),
//     );
//   });
// });
//
