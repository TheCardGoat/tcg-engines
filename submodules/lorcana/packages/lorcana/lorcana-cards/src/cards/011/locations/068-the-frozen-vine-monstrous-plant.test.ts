import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theFrozenVineMonstrousPlant } from "./068-the-frozen-vine-monstrous-plant";

const frozenResident = createMockCharacter({
  id: "frozen-vine-resident",
  name: "Frozen Vine Resident",
  cost: 2,
  willpower: 2,
});

const locationAttacker = createMockCharacter({
  id: "frozen-vine-attacker",
  name: "Frozen Vine Attacker",
  cost: 3,
  strength: 5,
  willpower: 4,
});

describe("The Frozen Vine - Monstrous Plant", () => {
  it("returns to hand when banished if an exerted character was there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          theFrozenVineMonstrousPlant,
          { card: frozenResident, atLocation: theFrozenVineMonstrousPlant, exerted: true },
        ],
      },
      {
        play: [locationAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(locationAttacker, theFrozenVineMonstrousPlant),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theFrozenVineMonstrousPlant),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("hand");
  });

  it("does not return to hand when banished if the character there was not exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          theFrozenVineMonstrousPlant,
          { card: frozenResident, atLocation: theFrozenVineMonstrousPlant },
        ],
      },
      {
        play: [locationAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(locationAttacker, theFrozenVineMonstrousPlant),
    ).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("discard");
  });

  it("does not return to hand when banished if no character was there", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theFrozenVineMonstrousPlant],
      },
      {
        play: [locationAttacker],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().challenge(locationAttacker, theFrozenVineMonstrousPlant),
    ).toBeSuccessfulCommand();
    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(testEngine.asPlayerOne().getCardZone(theFrozenVineMonstrousPlant)).toBe("discard");
  });
});
