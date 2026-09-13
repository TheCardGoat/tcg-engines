import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyDeterminedTraveler } from "./189-goofy-determined-traveler";

const ally = createMockCharacter({
  id: "goofy-determined-traveler-ally",
  name: "Ally",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const target = createMockCharacter({
  id: "goofy-determined-traveler-target",
  name: "Target",
  cost: 2,
  strength: 1,
  willpower: 4,
});

const lethalAttacker = createMockCharacter({
  id: "goofy-determined-traveler-lethal-attacker",
  name: "Lethal Attacker",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Goofy - Determined Traveler", () => {
  describe("FALLING ROCKS - Whenever this character quests, if you played another character this turn, you may deal 1 damage to chosen character or location.", () => {
    it("deals 1 damage when another character was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [ally],
          play: [{ card: goofyDeterminedTraveler, isDrying: false }],
          inkwell: ally.cost,
          deck: 1,
        },
        {
          play: [target],
          deck: 1,
        },
      );

      expect(testEngine.asPlayerOne().playCard(ally)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(goofyDeterminedTraveler)).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofyDeterminedTraveler, {
          resolveOptional: true,
          targets: [target],
        }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(target)).toBe(1);
    });
  });

  it("regression: is banished when damage equals willpower 2 (bugrepTuTwomo)", () => {
    // Player report: "goofy living with 2 damage". Goofy - Determined Traveler is 2/2;
    // damage >= willpower must banish him via GSC.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: lethalAttacker, isDrying: false }],
        deck: 1,
      },
      {
        play: [{ card: goofyDeterminedTraveler, exerted: true }],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(lethalAttacker, goofyDeterminedTraveler),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(goofyDeterminedTraveler)).toBe("discard");
  });
});
