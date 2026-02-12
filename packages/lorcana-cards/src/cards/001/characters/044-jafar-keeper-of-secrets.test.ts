import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { jafarKeeperOfSecrets } from "./044-jafar-keeper-of-secrets";

describe("Jafar - Keeper of Secrets", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [jafarKeeperOfSecrets] });
  //   Expect(testEngine.getCardModel(jafarKeeperOfSecrets).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jafarKeeperOfSecrets } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar - Keeper of Secrets", () => {
//   It("**HIDDEN WONDERS** This character gets +1 {S} for each card in your hand.", () => {
//     Const testStore = new TestStore({
//       Deck: 10,
//       Play: [jafarKeeperOfSecrets],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       JafarKeeperOfSecrets.id,
//     );
//
//     Expect(cardUnderTest.strength).toEqual(0);
//
//     TestStore.store.drawCard("player_one");
//     Expect(cardUnderTest.strength).toEqual(1);
//
//     TestStore.store.drawCard("player_one");
//     Expect(cardUnderTest.strength).toEqual(2);
//
//     TestStore.store.drawCard("player_one");
//     Expect(cardUnderTest.strength).toEqual(3);
//   });
// });
//
