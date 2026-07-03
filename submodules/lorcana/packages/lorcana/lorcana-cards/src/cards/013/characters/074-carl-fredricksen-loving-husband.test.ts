import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { carlFredricksenLovingHusband } from "./074-carl-fredricksen-loving-husband";

const ellieFredricksen = createMockCharacter({
  id: "carl-loving-husband-ellie",
  name: "Ellie Fredricksen",
  cost: 3,
});

const nonEllieCharacter = createMockCharacter({
  id: "carl-loving-husband-not-ellie",
  name: "Russell",
  cost: 4,
});

describe("Carl Fredricksen - Loving Husband", () => {
  it("reduces the next Ellie Fredricksen character you play this turn by 2 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [carlFredricksenLovingHusband, ellieFredricksen],
      inkwell: 5,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(carlFredricksenLovingHusband)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(ellieFredricksen)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ellieFredricksen)).toBe("play");
  });

  it("does not reduce or consume the reduction for a character not named Ellie Fredricksen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [carlFredricksenLovingHusband, nonEllieCharacter, ellieFredricksen],
      inkwell: 6,
      deck: 3,
    });

    expect(testEngine.asPlayerOne().playCard(carlFredricksenLovingHusband)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(5);

    expect(testEngine.asPlayerOne().playCard(nonEllieCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(nonEllieCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);

    expect(testEngine.asPlayerOne().playCard(ellieFredricksen)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ellieFredricksen)).toBe("play");
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
});
