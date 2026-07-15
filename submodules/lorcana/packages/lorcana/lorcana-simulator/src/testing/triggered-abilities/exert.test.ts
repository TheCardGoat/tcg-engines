import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { bambiEtherealFawn } from "@tcg/lorcana-cards/cards/011";

describe("GREAT PRINCE'S SON - Bambi, Ethereal Fawn - During your turn, whenever this character exerts, reveal a number of cards from the top of your deck equal to the number of cards under him.", () => {
  // Test cases to cover:
  // 1. Triggers whenever this character exerts (quests, challenges, sings, ability activation)
  // 2. Does NOT trigger when another character exerts
  // 3. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 4. Number of revealed cards equals cards currently under this character
  // 5. If no cards are under this character, reveals 0 cards (trigger still fires but does nothing)
  // 6. Fires multiple times if the character exerts multiple times in the same turn (readied between exerts)
  // 7. Cards revealed are shown to both players (not just the controller)

  it.todo("It should trigger when this character exerts during your turn", () => {});
});
