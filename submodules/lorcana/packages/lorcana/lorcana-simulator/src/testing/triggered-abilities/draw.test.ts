import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jafarStrikingIllusionist } from "@tcg/lorcana-cards/cards/003";

describe("I LOVE THE WAY YOUR FEEBLE MIND WORKS - Jafar, Striking Illusionist - During your turn, while this character is exerted, whenever you draw a card, gain 1 lore.", () => {
  // Test cases to cover:
  // 1. Triggers each time you draw a card during your turn while this character is exerted
  // 2. Does NOT trigger when opponent draws a card (on: YOU)
  // 3. Does NOT trigger if this character is NOT exerted (while restriction)
  // 4. Does NOT trigger during opponent's turn (during-your-turn restriction)
  // 5. Multiple cards drawn in one action trigger independently (draw 2 = 2 triggers = 2 lore)
  // 6. Drawing via ability effects (not just start-of-turn draw) also triggers
  // 7. Lore gain is cumulative across multiple draws in the same turn

  it.todo("It should trigger when you draw a card during your turn while this character is exerted", () => {});
});
