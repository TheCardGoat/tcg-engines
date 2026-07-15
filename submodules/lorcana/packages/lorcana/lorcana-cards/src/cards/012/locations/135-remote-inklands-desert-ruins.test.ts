import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { remoteInklandsDesertRuins } from "./135-remote-inklands-desert-ruins";

const explorer = createMockCharacter({
  id: "desert-ruins-explorer",
  name: "Desert Explorer",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Remote Inklands - Desert Ruins", () => {
  it("ERODING WINDS - mills 1 card at the start of your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [remoteInklandsDesertRuins],
        deck: 3,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(remoteInklandsDesertRuins).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCardsInZone("discard", PLAYER_ONE).count).toBe(1);
  });

  it("SUCCESSFUL EXPEDITION - characters get +2 strength while here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [remoteInklandsDesertRuins, explorer],
      inkwell: 2,
    });

    expect(testEngine.asPlayerOne().getCard(explorer)?.strength).toBe(explorer.strength);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(explorer, remoteInklandsDesertRuins).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(explorer)?.strength).toBe(explorer.strength + 2);
  });

  it("SUCCESSFUL EXPEDITION - characters not here do not get +2 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [remoteInklandsDesertRuins, explorer],
    });

    expect(testEngine.asPlayerOne().getCard(explorer)?.strength).toBe(explorer.strength);
  });
});
