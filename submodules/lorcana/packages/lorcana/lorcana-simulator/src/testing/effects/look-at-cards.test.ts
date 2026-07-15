import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";

describe("Look at cards effect - an effect that lets a player look at cards without taking action", () => {
  // Effect type(s): look-at-cards, look (alias), look-at-top (alias), look-at-deck (alias)
  //
  // Test cases to cover:
  // 1. look-at-cards: player sees N cards from the specified zone (pure information, no movement)
  // 2. look / look-at-top / look-at-deck aliases behave identically
  // 3. Player sees the cards, opponent does NOT (private information)
  // 4. Cards remain in the same order and zone after looking (no movement)
  // 5. Looking at an opponent's hand: opponent's cards are revealed to the active player
  // 6. Looking at an empty zone: no cards shown, no error
  // 7. Combined with another effect: look then act (e.g., look at top 2, then draw 1)

  it.todo("It should let the player view cards from a zone without moving them", () => {});
});
