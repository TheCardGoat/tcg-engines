import { describe, expect, it } from "bun:test";

import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "../../../testing";

/**
 * THE-973: two sequential challenges vs the same location should accumulate damage.
 */
describe("challenge same location twice in one turn", () => {
  it("applies damage from both challenges (no banishing)", () => {
    const location = createMockLocation({
      id: "the973-loc",
      name: "Eight WP Location",
      cost: 2,
      willpower: 8,
      lore: 0,
    });
    const attacker1 = createMockCharacter({
      id: "the973-a1",
      name: "Attacker One",
      cost: 1,
      strength: 2,
      willpower: 5,
      lore: 1,
    });
    const attacker2 = createMockCharacter({
      id: "the973-a2",
      name: "Attacker Two",
      cost: 1,
      strength: 3,
      willpower: 5,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker1, attacker2],
        deck: 1,
      },
      {
        play: [location],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    expect(p1.challenge(attacker1, location).success).toBe(true);
    expect(p1.getDamage(location)).toBe(2);

    expect(p1.challenge(attacker2, location).success).toBe(true);
    expect(p1.getDamage(location)).toBe(5);
    expect(p1.getCardZone(location)).toBe("play");
  });

  it("applies damage from both challenges (with banishing)", () => {
    const location = createMockLocation({
      id: "the973-loc",
      name: "Eight WP Location",
      cost: 2,
      willpower: 5,
      lore: 0,
    });
    const attacker1 = createMockCharacter({
      id: "the973-a1",
      name: "Attacker One",
      cost: 1,
      strength: 2,
      willpower: 5,
      lore: 1,
    });
    const attacker2 = createMockCharacter({
      id: "the973-a2",
      name: "Attacker Two",
      cost: 1,
      strength: 3,
      willpower: 5,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker1, attacker2],
        deck: 1,
      },
      {
        play: [location],
        deck: 1,
      },
    );

    const p1 = testEngine.asPlayerOne();
    expect(p1.challenge(attacker1, location).success).toBe(true);
    expect(p1.getDamage(location)).toBe(2);

    expect(p1.challenge(attacker2, location).success).toBe(true);
    expect(p1.getCardZone(location)).toBe("discard");
  });
});
