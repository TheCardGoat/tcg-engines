import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { turboRoyalHack } from "@tcg/lorcana-cards/cards/005";

describe("GAME JUMP - Turbo, Royal Hack - This character also counts as being named King Candy for Shift.", () => {
  // Test cases to cover:
  // 1. A King Candy card with Shift can be Shifted onto Turbo in play
  // 2. Turbo can be the Shift target because he counts as named King Candy
  // 3. Effects that check "has-named-character: King Candy" also recognize Turbo
  // 4. Turbo's printed name remains "Turbo" (alias only — does not replace name)
  // 5. The alias is only active while Turbo is in play (lost when banished)
  // 6. Cards with Shift(King Candy) can Shift onto Turbo at the reduced Shift cost

  it.todo("It should allow King Candy Shift cards to Shift onto this character", () => {});
});
