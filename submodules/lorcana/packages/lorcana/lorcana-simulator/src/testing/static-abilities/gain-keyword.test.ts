import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { rapunzelAppreciativeArtist } from "@tcg/lorcana-cards/cards/004";

describe("PERCEPTIVE PARTNER - Rapunzel, Appreciative Artist - While you have a character named Pascal in play, this character gains Ward.", () => {
  // Test cases to cover:
  // 1. Gains Ward while your Pascal is in play (opponent must bypass Ward to target her)
  // 2. Does NOT have Ward when Pascal is not in play (opponent can freely target)
  // 3. Ward condition checks YOUR character named Pascal only — not opponent's Pascal
  // 4. If Pascal is banished, Ward is immediately lost
  // 5. Multiple Pascals in play still grant only one instance of Ward (boolean keyword)
  // 6. Ward prevents opponent's targeted effects but not non-targeted or area effects

  it.todo("It should gain Ward while you have a character named Pascal in play", () => {});
});
