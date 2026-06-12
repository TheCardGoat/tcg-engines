import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { skullRockIsolatedFortress } from "./136-skull-rock-isolated-fortress";

const visitingPirate = createMockCharacter({
  id: "skull-rock-pirate",
  name: "Visiting Pirate",
  cost: 2,
  classifications: ["Storyborn", "Pirate"],
  strength: 2,
  willpower: 3,
});

const outsider = createMockCharacter({
  id: "skull-rock-outsider",
  name: "Outsider",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Skull Rock - Isolated Fortress", () => {
  it("gives characters here +1 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        skullRockIsolatedFortress,
        { card: visitingPirate, atLocation: skullRockIsolatedFortress },
        outsider,
      ],
    });

    expect(testEngine.asPlayerOne().getCard(visitingPirate)?.strength).toBe(
      visitingPirate.strength + 1,
    );
    expect(testEngine.asPlayerOne().getCard(outsider)?.strength).toBe(outsider.strength);
  });

  // Rule 6.2.4: Secondary condition "if you have a Pirate character here" is checked
  // at resolution. Without a Pirate at the location, the effect resolves with no effect.
  // FAQ: "Can I use Transport Pod to move a Pirate to an empty Skull Rock in order to
  // gain 1 lore? No. Safe Haven has a secondary condition that must be true at the start
  // of the turn in order to trigger."
  it("does not gain lore if no Pirate character is at the location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          skullRockIsolatedFortress,
          { card: outsider, atLocation: skullRockIsolatedFortress },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // No bag effect should fire since the secondary condition fails
    // (no Pirate at the location)
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      // If the trigger fired, resolving should produce no lore
      testEngine.asPlayerOne().resolvePendingByCard(skullRockIsolatedFortress);
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("gains 1 lore at the start of your turn if you have a Pirate here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          skullRockIsolatedFortress,
          { card: visitingPirate, atLocation: skullRockIsolatedFortress },
        ],
        deck: 1,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(skullRockIsolatedFortress).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
