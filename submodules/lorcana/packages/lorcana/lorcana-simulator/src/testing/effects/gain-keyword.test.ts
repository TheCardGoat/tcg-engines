import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { flotsamUrsulasSpy } from "@tcg/lorcana-cards/cards/001";

describe("FLOTSAM - Ursula's Spy - Whenever this character quests, chosen character gains Evasive until the start of your next turn.", () => {
  // Effect type(s): gain-keyword, grant-keyword (alias), gain-keywords (alias), grant-keywords (alias)
  //
  // Test cases to cover:
  // 1. gain-keyword: character gains a keyword for the rest of the turn (or defined duration)
  // 2. grant-keyword / grant-keywords / gain-keywords aliases behave identically
  // 3. Multiple keywords granted in a single effect all apply simultaneously
  // 4. Keyword applies immediately (character can use it right away in the same turn)
  // 5. Keyword expires at the defined duration (this turn, until start of next turn, permanently)
  // 6. Evasive granted to an exerted character: opponent can no longer challenge it
  // 7. Keyword grant is a separate modifier (doesn't remove existing keywords)

  it.todo("It should grant the specified keyword to the target character for the defined duration", () => {});
});
