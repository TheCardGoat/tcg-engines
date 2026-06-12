import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { emeraldCoil } from "./120-emerald-coil";

const inkCard = createMockCharacter({
  id: "emerald-coil-ink-card",
  name: "Emerald Coil Ink Card",
  cost: 1,
});

const evasiveTarget = createMockCharacter({
  id: "emerald-coil-target",
  name: "Emerald Coil Target",
  cost: 2,
});

describe("Emerald Coil", () => {
  it("grants Evasive until the start of your next turn when you ink a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        hand: [inkCard],
        play: [emeraldCoil, evasiveTarget],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(emeraldCoil, {
        targets: [evasiveTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: evasiveTarget, keyword: "Evasive" });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).toHaveKeyword({ card: evasiveTarget, keyword: "Evasive" });

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: evasiveTarget,
      keyword: "Evasive",
    });
  });
});
