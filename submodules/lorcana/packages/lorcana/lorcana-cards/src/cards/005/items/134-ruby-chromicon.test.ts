import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rubyChromicon } from "./134-ruby-chromicon";

const empoweredAlly = createMockCharacter({
  id: "ruby-chromicon-target",
  name: "Empowered Ally",
  cost: 2,
  strength: 3,
});

describe("Ruby Chromicon", () => {
  it("gives the chosen character +1 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      play: [rubyChromicon, empoweredAlly],
    });

    const baseStrength = testEngine.asPlayerOne().getCardStrength(empoweredAlly);

    expect(
      testEngine.asPlayerOne().activateAbility(rubyChromicon, {
        targets: [empoweredAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(empoweredAlly)).toBe(baseStrength + 1);
  });
});
