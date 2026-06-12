import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { donaldDuckFlusteredSorcerer } from "@tcg/lorcana-cards/cards/007";

describe("OBFUSCATE! - Donald Duck, Flustered Sorcerer - Opponents need 25 lore to win the game.", () => {
  // Test cases to cover:
  // 1. Opponent reaching 20 lore does NOT win the game while Donald is in play
  // 2. Opponent must reach exactly 25 lore to win
  // 3. YOUR lore requirement remains 20 to win (only opponents are affected)
  // 4. When Donald Duck is banished, opponent's win requirement returns to 20
  // 5. If opponent already has 20+ lore when Donald enters play, they do not immediately win
  //    (must now reach 25 lore before winning condition is checked again)
  // 6. Two Donald Ducks in play: the effect should not stack to 30 (same loreRequired value)

  it.todo("It should require opponents to reach 25 lore to win instead of 20", () => {});
});
