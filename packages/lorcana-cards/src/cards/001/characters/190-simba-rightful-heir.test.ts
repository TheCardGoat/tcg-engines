import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { simbaRightfulHeir } from "./190-simba-rightful-heir";

describe("Simba - Rightful Heir", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [simbaRightfulHeir] });
  //   expect(testEngine.getCardModel(simbaRightfulHeir).hasKeyword()).toBe(true);
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
//   simbaRightfulHeir,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Simba - Rightful Heir", () => {
//   it("**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.", () => {
//     const testStore = new TestStore(
//       {
//         play: [simbaRightfulHeir],
//       },
//       {
//         play: [heiheiBoatSnack],
//       },
//     );
//
//     const attacker = testStore.getByZoneAndId("play", simbaRightfulHeir.id);
//     const defender = testStore.getByZoneAndId(
//       "play",
//       heiheiBoatSnack.id,
//       "player_two",
//     );
//
//     defender.updateCardMeta({ exerted: true });
//
//     expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(0);
//     attacker.challenge(defender);
//     expect(testStore.store.tableStore.getTable("player_one").lore).toEqual(1);
//   });
// });
//
