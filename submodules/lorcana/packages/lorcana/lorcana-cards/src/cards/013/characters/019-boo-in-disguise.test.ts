import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { booInDisguise } from "./019-boo-in-disguise";

const sulley = createMockCharacter({
  id: "boo-in-disguise-sulley",
  name: "Sulley",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
});

const attacker = createMockCharacter({
  id: "boo-in-disguise-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Boo - In Disguise", () => {
  it("cannot be challenged while you have an exerted Sulley in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: booInDisguise, exerted: true },
          { card: sulley, exerted: true },
        ],
        deck: 1,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, booInDisguise)).not.toBeSuccessfulCommand();
  });

  it("can be challenged when Sulley is ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: booInDisguise, exerted: true }, sulley],
        deck: 1,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, booInDisguise)).toBeSuccessfulCommand();
  });
});
