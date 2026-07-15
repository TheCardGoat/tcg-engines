import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { brunoMadrigalUndetectedUncle } from "@tcg/lorcana-cards/cards/009";

describe("GIFT OF THE MADRIGALS - Bruno Madrigal, Undetected Uncle - Name a card, then reveal the top card of your deck. If it's the named card, put it into your hand and gain 1 lore.", () => {
  // Effect type(s): sequence, compound (deprecated alias)
  //
  // Test cases to cover:
  // 1. All effects in the sequence execute in order (name-a-card → reveal → conditional → put-in-hand + gain-lore)
  // 2. If an early step has no valid targets, the sequence continues with remaining steps
  // 3. Targeting in effect N uses the result of effect N-1 (chained context)
  // 4. sequence within sequence (nested) resolves correctly
  // 5. compound (deprecated alias) behaves identically to sequence
  // 6. If a step is optional and declined, subsequent steps that depend on it are skipped

  it.todo("It should execute all effects in the sequence in order", () => {});
});
