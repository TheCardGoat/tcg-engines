import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theVineToweringStalk } from "./197-the-vine-towering-stalk";

const floodbornBase = createMockCharacter({
  id: "vine-towering-stalk-floodborn-base",
  name: "Floodborn Base",
  cost: 2,
  classifications: ["Floodborn"],
});

const exertedFloodborn = createMockCharacter({
  id: "vine-towering-stalk-exerted-floodborn",
  name: "Exerted Floodborn",
  cost: 2,
  classifications: ["Floodborn"],
});

const floodbornDefender = createMockCharacter({
  id: "vine-towering-stalk-floodborn-defender",
  name: "Floodborn Defender",
  cost: 2,
  strength: 0,
  willpower: 1,
  classifications: ["Floodborn"],
});

const attacker = createMockCharacter({
  id: "vine-towering-stalk-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("The Vine - Towering Stalk", () => {
  it("can be shifted onto a Floodborn character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [floodbornBase],
      hand: [theVineToweringStalk],
      inkwell: 7,
      deck: [],
    });
    const shiftTarget = testEngine.findCardInstanceId(floodbornBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(theVineToweringStalk, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theVineToweringStalk)).toBe("play");
  });

  it("gives your other exerted Floodborn characters Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theVineToweringStalk, { card: exertedFloodborn, exerted: true }],
      deck: [],
    });

    expect(testEngine.asPlayerOne().hasKeyword(exertedFloodborn, "Bodyguard")).toBe(true);
  });

  it("deals 1 damage to each opposing character when your Floodborn is banished on an opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theVineToweringStalk, { card: floodbornDefender, exerted: true }],
        deck: 2,
      },
      {
        play: [{ card: attacker, isDrying: false }],
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().challenge(attacker, floodbornDefender)).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    expect(testEngine.asPlayerTwo().getDamage(attacker)).toBe(1);
  });
});
