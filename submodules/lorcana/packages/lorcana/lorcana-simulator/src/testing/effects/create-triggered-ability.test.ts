import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { whosWithMe } from "@tcg/lorcana-cards/cards/005";

describe('WHO\'S WITH ME? - Each of your characters gains "Whenever this character challenges, you may draw a card" this turn.', () => {
  // Effect type(s): create-triggered-ability
  //
  // Test cases to cover:
  // 1. create-triggered-ability: creates a temporary triggered ability on a card
  // 2. The trigger fires when the specified event occurs (e.g., character challenges)
  // 3. Duration: typically "this turn" or "until end of your next turn"
  // 4. The created trigger is removed when its duration expires
  // 5. Does NOT permanently add the ability to the card's base definition
  // 6. Multiple characters affected: each gets a separate trigger instance
  // 7. Characters played after the effect resolves do NOT get the created trigger

  it.todo("It should create a temporary triggered ability that fires until the duration expires", () => {});
});
