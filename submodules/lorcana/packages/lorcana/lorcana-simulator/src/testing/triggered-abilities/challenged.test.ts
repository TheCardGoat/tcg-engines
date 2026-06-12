import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { megaraSecretKeeper } from "@tcg/lorcana-cards/cards/010";

describe("I WON'T SAY I'M IN LOVE - Megara, Secret Keeper - Whenever this character is challenged, each opponent chooses and discards a card.", () => {
  // Test cases to cover:
  // 1. Triggers when this character is the defender in a challenge
  // 2. Does NOT trigger when this character is the attacker initiating a challenge
  // 3. Does NOT trigger when another of your characters is challenged
  // 4. Triggers even if this character is banished in the challenge
  // 5. Opponent must have at least one card to discard (no trigger if opponent's hand is empty)
  // 6. Effect fires during your turn if opponent initiates challenge against your exerted character
  //    and also during opponent's turn if you challenge their character that has this ability

  it.todo("It should trigger when this character is the defender in a challenge", () => {});
});
