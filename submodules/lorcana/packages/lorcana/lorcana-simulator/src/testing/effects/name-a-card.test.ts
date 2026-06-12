import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { brunoMadrigalUndetectedUncle } from "@tcg/lorcana-cards/cards/009";

describe("GIFT OF THE MADRIGALS - Bruno Madrigal, Undetected Uncle - Name a card, then reveal the top card of your deck.", () => {
  // Effect type(s): name-a-card
  //
  // Test cases to cover:
  // 1. name-a-card: player declares a card name (stored for use by a subsequent effect)
  // 2. The declared name is stored in context and accessible by reveal-and-conditional
  // 3. Any valid card name can be declared (no restriction by default)
  // 4. The effect following name-a-card checks if the revealed card matches the named card
  // 5. Declaring a card name that does not exist in the game: valid declaration, reveal won't match
  // 6. name-a-card is always the first step (setup step before reveal/check)
  // 7. The declared name persists for the entire sequence resolution

  it.todo("It should store the player's declared card name for use by subsequent effects", () => {});
});
