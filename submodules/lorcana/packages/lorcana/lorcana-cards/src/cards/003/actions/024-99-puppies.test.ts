import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  cruellaDeVilMiserableAsUsual,
  dukeOfWeseltonOpportunisticOfficial,
  genieTheEverImpressive,
} from "../../001";
import { _99Puppies } from "./024-99-puppies";

describe("99 Puppies", () => {
  it("gives each of your characters bonus lore when they quest this turn", () => {
    const cardsInPlay = [
      genieTheEverImpressive,
      dukeOfWeseltonOpportunisticOfficial,
      cruellaDeVilMiserableAsUsual,
    ] as const;
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [_99Puppies],
        inkwell: _99Puppies.cost,
        deck: 3,
        play: [...cardsInPlay],
      },
      {
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().playCard(_99Puppies)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    let expectedLore = 0;
    cardsInPlay.forEach((card) => {
      expect(testEngine.asPlayerOne().quest(card)).toBeSuccessfulCommand();
      expectedLore += card.lore + 1;
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(expectedLore);
    });
  });

  it("expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [_99Puppies],
        inkwell: _99Puppies.cost,
        play: [genieTheEverImpressive],
        deck: 3,
      },
      {
        deck: 3,
      },
    );

    expect(testEngine.asPlayerOne().playCard(_99Puppies)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(genieTheEverImpressive)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
