import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { croquetMallet } from "./066-croquet-mallet";

const hurriedHero = createMockCharacter({
  id: "croquet-mallet-hurried-hero",
  name: "Hurried Hero",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const waitingDefender = createMockCharacter({
  id: "croquet-mallet-waiting-defender",
  name: "Waiting Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Croquet Mallet", () => {
  it("banishes itself to give the chosen character Rush this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [croquetMallet, { card: hurriedHero, isDrying: true }],
      },
      {
        play: [{ card: waitingDefender, exerted: true }],
      },
    );
    expect(testEngine.asPlayerOne().hasKeyword(hurriedHero, "Rush")).toBe(false);

    const result = testEngine.asPlayerOne().activateAbility(croquetMallet, {
      targets: [hurriedHero],
    });

    expect(result).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(hurriedHero, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(hurriedHero, waitingDefender)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(croquetMallet)).toBe("discard");
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(hurriedHero, "Rush")).toBe(false);
  });
});
