import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { teKaHeartless } from "./192-te-ka-heartless";

describe("Te Ka - Heartless", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [teKaHeartless] });
  //   expect(testEngine.getCardModel(teKaHeartless).hasKeyword()).toBe(true);
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
//   heiheiBoatSnack,
//   teKaHeartless,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// export const teKaHeartlessTestCase = () => {
//   const testStore = new TestStore(
//     {
//       play: [teKaHeartless],
//     },
//     {
//       play: [heiheiBoatSnack],
//     },
//   );
//
//   const attacker = testStore.getByZoneAndId("play", teKaHeartless.id);
//   const defender = testStore.getByZoneAndId(
//     "play",
//     heiheiBoatSnack.id,
//     "player_two",
//   );
//
//   defender.updateCardMeta({ exerted: true });
//
//   expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//   attacker.challenge(defender);
//   expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(2);
// };
//
// describe("Te Ka - Heartless", () => {
//   it("During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.", () => {
//     teKaHeartlessTestCase();
//   });
// });
//
