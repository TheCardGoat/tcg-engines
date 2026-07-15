import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rhinoMotivationalSpeaker } from "@tcg/lorcana-cards/cards/007";

describe("DESTINY CALLING - Rhino, Motivational Speaker - Your other characters get +2 {W}.", () => {
  // Test cases to cover:
  // 1. All your OTHER characters in play get +2 willpower while Rhino is in play
  // 2. Rhino himself does NOT get the bonus (YOUR_OTHER_CHARACTERS excludes self)
  // 3. Opponent's characters are NOT buffed
  // 4. Characters that enter play AFTER Rhino also immediately get +2 willpower
  // 5. When Rhino is banished, the bonus is removed from all characters
  // 6. Two Rhinoes in play stack (+4 willpower to other characters)
  // 7. Willpower increase affects survivability in challenges (higher banish threshold)

  it.todo("It should give +2 willpower to all your other characters while in play", () => {});
});
