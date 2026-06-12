import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { motherGothelWitheredAndWicked } from "@tcg/lorcana-cards/cards/002";

describe("MOTHER GOTHEL - Withered and Wicked - This character enters play with damage on it.", () => {
  // Effect type(s): enters-play-modification, enters-play-with (alias), enters-with-damage
  //
  // Test cases to cover:
  // 1. enters-play-modification: modifies how a character enters play (before it's fully in play)
  // 2. enters-play-with: card enters play with specific state (damage, tokens, etc.)
  // 3. enters-with-damage: character enters play with a specified amount of damage already applied
  // 4. Modification applies only at entry time, not as an ongoing effect
  // 5. Character with enters-with-damage: if damage >= willpower at entry, character is immediately banished
  // 6. Multiple enters-play-modifications for the same card: all apply simultaneously
  // 7. Modifications from effects (not printed) apply on top of printed modifications

  it.todo("It should apply the specified modification to a character as it enters play", () => {});
});
