import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { johnSilverAlienPirate } from "./082-john-silver-alien-pirate";

describe("John Silver - Alien Pirate", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [johnSilverAlienPirate] });
  //   Expect(testEngine.getCardModel(johnSilverAlienPirate).hasKeyword()).toBe(true);
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
//   JohnSilverAlienPirate,
//   PascalRapunzelCompanion,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("John Silver - Alien Pirate", () => {
//   Describe("Pick Your Fights - When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn.", () => {
//     It("On play", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Inkwell: johnSilverAlienPirate.cost,
//           Hand: [johnSilverAlienPirate],
//         },
//         {
//           Deck: 2,
//           Play: [pascalRapunzelCompanion],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         JohnSilverAlienPirate.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         PascalRapunzelCompanion.id,
//         "player_two",
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       // Character gets "Reckless" on their turn
//       Expect(target.hasReckless).toBeFalsy();
//       TestStore.passTurn();
//       Expect(target.hasReckless).toBeTruthy();
//
//       // Character loses "Reckless" when they pass their turn
//       TestStore.passTurn();
//       Expect(target.hasReckless).toBeFalsy();
//     });
//
//     It("On quest", () => {
//       Const testStore = new TestStore(
//         {
//           Deck: 2,
//           Inkwell: johnSilverAlienPirate.cost,
//           Play: [johnSilverAlienPirate],
//         },
//         {
//           Deck: 2,
//           Play: [pascalRapunzelCompanion],
//         },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         JohnSilverAlienPirate.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         PascalRapunzelCompanion.id,
//         "player_two",
//       );
//
//       CardUnderTest.quest();
//       TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//       // Character gets "Reckless" on their turn
//       Expect(target.hasReckless).toBeFalsy();
//       TestStore.passTurn();
//       Expect(target.hasReckless).toBeTruthy();
//     });
//   });
// });
//
