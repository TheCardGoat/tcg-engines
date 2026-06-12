import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mushusRocket } from "./134-mushus-rocket";

const freshAlly = createMockCharacter({
  id: "mushus-rocket-fresh-ally",
  name: "Fresh Ally",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const challengeDummy = createMockCharacter({
  id: "mushus-rocket-dummy",
  name: "Challenge Dummy",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Mushu's Rocket", () => {
  it("gives the chosen character Rush when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mushusRocket],
        inkwell: mushusRocket.cost,
        play: [{ card: freshAlly, isDrying: true }],
      },
      {
        play: [{ card: challengeDummy, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(freshAlly, challengeDummy)).toBe(false);
    expect(testEngine.asPlayerOne().playCard(mushusRocket)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mushusRocket, {
        targets: [freshAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canChallenge(freshAlly, challengeDummy)).toBe(true);
  });

  it("banishes itself to give the chosen character Rush", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [mushusRocket, { card: freshAlly, isDrying: true }],
      },
      {
        play: [{ card: challengeDummy, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(freshAlly, challengeDummy)).toBe(false);
    expect(
      testEngine.asPlayerOne().activateAbility(mushusRocket, {
        ability: "HITCH A RIDE",
        targets: [freshAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(mushusRocket)).toBe("discard");
    expect(testEngine.asPlayerOne().canChallenge(freshAlly, challengeDummy)).toBe(true);
  });
});
