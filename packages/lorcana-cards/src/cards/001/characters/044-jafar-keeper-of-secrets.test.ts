import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { jafarKeeperOfSecrets } from "./044-jafar-keeper-of-secrets";

describe("Jafar - Keeper of Secrets", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [jafarKeeperOfSecrets] });
  //   expect(testEngine.getCardModel(jafarKeeperOfSecrets).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { jafarKeeperOfSecrets } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jafar - Keeper of Secrets", () => {
//   it("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", () => {
//     const testStore = new TestStore({
//       deck: 10,
//       play: [jafarKeeperOfSecrets],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       jafarKeeperOfSecrets.id,
//     );
//
//     expect(cardUnderTest.strength).toEqual(0);
//
//     testStore.store.drawCard("player_one");
//     expect(cardUnderTest.strength).toEqual(1);
//
//     testStore.store.drawCard("player_one");
//     expect(cardUnderTest.strength).toEqual(2);
//
//     testStore.store.drawCard("player_one");
//     expect(cardUnderTest.strength).toEqual(3);
//   });
// });
//
