import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rubyCoil } from "./149-ruby-coil";

const inkCard = createMockCharacter({
  id: "ruby-coil-ink-card",
  name: "Ruby Coil Ink Card",
  cost: 1,
});

const strengthTarget = createMockCharacter({
  id: "ruby-coil-strength-target",
  name: "Ruby Coil Strength Target",
  cost: 2,
  strength: 2,
});

describe("Ruby Coil", () => {
  it("gives the chosen character +2 strength this turn when you ink a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [inkCard],
      play: [rubyCoil, strengthTarget],
    });

    expect(testEngine.asPlayerOne().ink(inkCard)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rubyCoil, {
        targets: [strengthTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(4);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(strengthTarget)).toBe(2);
  });
});
