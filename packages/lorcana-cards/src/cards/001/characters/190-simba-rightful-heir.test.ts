import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { simbaRightfulHeir } from "./190-simba-rightful-heir";

describe("Simba - Rightful Heir", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [simbaRightfulHeir] });
  //   Expect(testEngine.getCardModel(simbaRightfulHeir).hasKeyword()).toBe(true);
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
//   HeiheiBoatSnack,
//   SimbaRightfulHeir,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Simba - Rightful Heir", () => {
//   It("**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [simbaRightfulHeir],
//       },
//       {
//         Play: [heiheiBoatSnack],
//       },
//     );
//
//     Const attacker = testStore.getByZoneAndId("play", simbaRightfulHeir.id);
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       HeiheiBoatSnack.id,
//       "player_two",
//     );
//
//     Defender.updateCardMeta({ exerted: true });
//
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//     Attacker.challenge(defender);
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//   });
// });
//
