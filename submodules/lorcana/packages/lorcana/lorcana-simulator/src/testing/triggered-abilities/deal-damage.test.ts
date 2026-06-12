import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mulanEliteArcher } from "@tcg/lorcana-cards/cards/009";

describe("FIRE AT WILL - Mulan, Elite Archer - During your turn, whenever this character deals damage to another character in a challenge, deal the same amount of damage to up to 2 other chosen characters.", () => {
  // Test cases to cover:
  // 1. Triggers when this character deals damage in a challenge during your turn
  // 2. Does NOT trigger when another character deals damage in a challenge
  // 3. Does NOT trigger when this character deals damage via an effect (not challenge)
  // 4. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 5. Splash damage amount equals exactly what was dealt in the challenge
  // 6. Player may choose 0, 1, or up to 2 targets for the splash (up to 2)
  // 7. Splash damage can target characters on either side (including your own)
  // 8. Splash damage can banish characters, but does not re-trigger this ability

  it.todo("It should trigger when this character deals damage in a challenge during your turn", () => {});
});
