import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { teKaHeartless } from "./192-te-ka-heartless";

describe("Te Ka - Heartless", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [teKaHeartless] });
  //   Expect(testEngine.getCardModel(teKaHeartless).hasKeyword()).toBe(true);
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
//   TeKaHeartless,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Export const teKaHeartlessTestCase = () => {
//   Const testStore = new TestStore(
//     {
//       Play: [teKaHeartless],
//     },
//     {
//       Play: [heiheiBoatSnack],
//     },
//   );
//
//   Const attacker = testStore.getByZoneAndId("play", teKaHeartless.id);
//   Const defender = testStore.getByZoneAndId(
//     "play",
//     HeiheiBoatSnack.id,
//     "player_two",
//   );
//
//   Defender.updateCardMeta({ exerted: true });
//
//   Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//   Attacker.challenge(defender);
//   Expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
// };
//
// Describe("Te Ka - Heartless", () => {
//   It("During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
//     TeKaHeartlessTestCase();
//   });
// });
//
