import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { aladdinHeroicOutlaw } from "./104-aladdin-heroic-outlaw";

describe("Aladdin - Heroic Outlaw", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [aladdinHeroicOutlaw] });
  //   Expect(testEngine.getCardModel(aladdinHeroicOutlaw).hasKeyword()).toBe(true);
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
//   AladdinHeroicOutlaw,
//   HeiheiBoatSnack,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Aladdin - Heroic Outlaw", () => {
//   It("During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [aladdinHeroicOutlaw],
//         Lore: 1,
//       },
//       {
//         Play: [heiheiBoatSnack],
//         Lore: 3,
//       },
//     );
//
//     Const attacker = testStore.getByZoneAndId("play", aladdinHeroicOutlaw.id);
//     Const defender = testStore.getByZoneAndId(
//       "play",
//       HeiheiBoatSnack.id,
//       "player_two",
//     );
//
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(3);
//
//     Defender.updateCardMeta({ exerted: true });
//     Attacker.challenge(defender);
//
//     Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(3);
//     Expect(testStore.store.tableStore.getTable("player_two").lore).toEqual(1);
//   });
// });
//
