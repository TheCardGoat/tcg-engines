/**
 * Bug 3 — "Hades — Infernal Schemer" chooser inversion (17 daily user reports).
 *
 * Card text: "When you play this character, you may put chosen opposing
 * character into their player's inkwell facedown."
 *
 * Modeled as { type: "optional", chooser: "CONTROLLER", effect: { type:
 * "put-into-inkwell", target: "OPPONENT", source: { selector: "chosen", owner:
 * "opponent", ... } } }.
 *
 * The wrapper correctly resolved the chooser to the controller, but the inner
 * generic target-selection builder overrode it via a "target → chooser"
 * fallback heuristic. For movement effects (put-into-inkwell, move-to-hand,
 * deal-damage), target describes destination/recipient — not chooser — so the
 * heuristic mis-routed Hades' choice prompt to the opponent.
 *
 * Engine-only repro using mock cards.
 */

import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine, PLAYER_ONE } from "../testing";

const hadesLikePlayTrigger = createMockCharacter({
  id: "bug3-hades-like",
  name: "Hades-like",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  abilities: [
    {
      id: "bug3-1",
      name: "DOWNSIDE",
      text: "When you play this character, you may put chosen opposing character into their player's inkwell facedown.",
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          target: "OPPONENT",
          facedown: true,
          source: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
});

const opposingTarget = createMockCharacter({
  id: "bug3-opposing",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("bug-3: optional 'chooser: CONTROLLER' wrapping movement effect with target=OPPONENT", () => {
  it("bag chooserId is the player who played the source card, not the opponent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [hadesLikePlayTrigger], inkwell: hadesLikePlayTrigger.cost, deck: 1 },
      { play: [opposingTarget], deck: 1 },
    );

    expect(testEngine.asPlayerOne().playCard(hadesLikePlayTrigger)).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects.length).toBe(1);
    expect(bagEffects[0]!.chooserId).toBe(PLAYER_ONE);
  });
});
