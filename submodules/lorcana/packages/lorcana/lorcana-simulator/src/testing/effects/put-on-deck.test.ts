import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { belleMechanicExtraordinaire } from "@tcg/lorcana-cards/cards/007";

describe("BELLE - Mechanic Extraordinaire - REPURPOSE: Put each card moved to your inkwell on the bottom of your deck.", () => {
  // Effect type(s): put-on-top, put-on-bottom, shuffle-into-deck
  //
  // Test cases to cover:
  // 1. put-on-top: places cards on top of the deck (in the specified order for multiple cards)
  // 2. put-on-bottom: places cards on the bottom of the deck
  // 3. shuffle-into-deck: shuffles the card into the deck at a random position
  // 4. Multiple cards put on top: first listed goes on top vs. player chooses order
  // 5. Putting to an empty deck: deck now has 1 card (the placed card)
  // 6. Zone-change event fires when card moves to deck
  // 7. Cards put on deck are facedown and unknown to both players

  it.todo("It should place the specified card on the top or bottom of the deck", () => {});
});
