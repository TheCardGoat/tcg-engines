import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { smash } from "../../001";
import { davidXanatosCharismaticLeader } from "./116-david-xanatos-charismatic-leader";

const allyToBanish = createMockCharacter({
  id: "david-xanatos-charismatic-ally",
  name: "Ally To Banish",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const rushTarget = createMockCharacter({
  id: "david-xanatos-rush-target",
  name: "Rush Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("David Xanatos - Charismatic Leader", () => {
  it("LEARN FROM EVERYTHING - draws a card when one of your characters is banished during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [davidXanatosCharismaticLeader, allyToBanish],
        hand: [smash],
        inkwell: smash.cost,
        deck: [rushTarget, rushTarget],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(
      testEngine.asPlayerOne().playCard(smash, { targets: [allyToBanish] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("does not draw when your character is banished during the opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [davidXanatosCharismaticLeader, allyToBanish],
        deck: 2,
      },
      {
        hand: [smash],
        inkwell: smash.cost,
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(smash, { targets: [allyToBanish] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });

  it("WHAT ARE YOU WAITING FOR? - gives a chosen character Rush this turn when David quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: davidXanatosCharismaticLeader, isDrying: false }, rushTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(davidXanatosCharismaticLeader)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(davidXanatosCharismaticLeader, {
        targets: [rushTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(rushTarget, "Rush")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(rushTarget, "Rush")).toBe(false);
  });
});
