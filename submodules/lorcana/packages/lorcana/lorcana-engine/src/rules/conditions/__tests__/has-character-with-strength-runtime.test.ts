/**
 * Regression: `has-character-with-strength` must use LIVE strength,
 * not printed base strength.
 *
 * Bug 3 — Mulan (Ready for Battle) FIGHTING SPIRIT reduces cost by 1 when you
 * control a character with strength >= 5. A character whose printed strength
 * is < 5 but is boosted by a static (+X strength) should satisfy the check.
 *
 * Engine-only test: uses mock cards (engine cannot import @tcg/lorcana-cards).
 */

import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine, PLAYER_ONE } from "../../../testing";

// Mulan-like hand card: cost 4, FIGHTING SPIRIT cost reduction.
const mulanLike = createMockCharacter({
  id: "bug3-mulan",
  name: "Mulan",
  version: "Ready for Battle",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  abilities: [
    {
      id: "bug3-fighting-spirit",
      name: "FIGHTING SPIRIT",
      condition: {
        type: "has-character-with-strength",
        comparison: "greater-or-equal",
        value: 5,
        controller: "you",
      },
      effect: {
        type: "cost-reduction",
        amount: 1,
        cardType: "character",
      },
      sourceZones: ["hand"],
      text: "FIGHTING SPIRIT",
      type: "static",
    },
  ],
});

// Static emitter: grants +2 strength to all your characters (lifts a 4/4 to 6/4).
const bannerOfStrength = createMockCharacter({
  id: "bug3-banner",
  name: "Banner of Strength",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  abilities: [
    {
      id: "bug3-banner-static",
      name: "GLOBAL BOOST",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "Your characters get +2 strength.",
    },
  ],
});

// A 4/4 character — printed strength 4, boosted to 6 by the banner.
const fighter = createMockCharacter({
  id: "bug3-fighter",
  name: "Fighter",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
});

describe("bug-3 — has-character-with-strength uses runtime strength", () => {
  it("FIGHTING SPIRIT reduces Mulan's cost when a boosted ally has runtime strength >= 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mulanLike],
        play: [
          { card: bannerOfStrength, isDrying: false },
          { card: fighter, isDrying: false },
        ],
        // Printed cost 4, reduced to 3 — provide exactly 3 ink.
        inkwell: 3,
        deck: 3,
      },
      { deck: 3 },
    );

    const fighterCard = testEngine.asPlayerOne().getCard(fighter);
    expect(fighterCard.strength).toBe(6);

    expect(testEngine.asPlayerOne().playCard(mulanLike)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mulanLike)).toBe("play");
    // sanity: player one is the actor
    void PLAYER_ONE;
  });
});
