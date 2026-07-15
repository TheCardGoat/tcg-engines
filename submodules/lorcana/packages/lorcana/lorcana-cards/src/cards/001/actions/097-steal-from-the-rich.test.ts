import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  cruellaDeVilMiserableAsUsual,
  dukeOfWeseltonOpportunisticOfficial,
  genieTheEverImpressive,
} from "../../001";
import { frecklesGoodBoy, thunderboltWonderDog } from "../../007";
import { stealFromTheRich } from "./097-steal-from-the-rich";

describe("Steal from the Rich", () => {
  it("makes each opponent lose 1 lore whenever one of your characters quests this turn", () => {
    const cardsInPlay = [
      genieTheEverImpressive,
      dukeOfWeseltonOpportunisticOfficial,
      cruellaDeVilMiserableAsUsual,
    ] as const;
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        deck: 1,
        play: [...cardsInPlay],
      },
      {
        deck: 2,
      },
    );

    testEngine.asServer().manualSetLore(PLAYER_TWO, 3);

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    cardsInPlay.forEach((card, index) => {
      expect(testEngine.asPlayerOne().quest(card)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(index + 1);
      expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2 - index);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  it("still triggers for a character that enters later in the turn and quests after shifting", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich, thunderboltWonderDog],
        inkwell: stealFromTheRich.cost + 3,
        play: [frecklesGoodBoy],
      },
      {
        deck: 2,
      },
    );

    testEngine.asServer().manualSetLore(PLAYER_TWO, 3);
    const frecklesId = testEngine.findCardInstanceId(frecklesGoodBoy, "play", PLAYER_ONE);

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(thunderboltWonderDog, {
        cost: {
          cost: "shift",
          shiftTarget: frecklesId,
        },
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().quest(thunderboltWonderDog)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(2);
  });

  it("expires at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [stealFromTheRich],
        inkwell: stealFromTheRich.cost,
        deck: 1,
        play: [genieTheEverImpressive],
      },
      {
        deck: 2,
      },
    );

    testEngine.asServer().manualSetLore(PLAYER_TWO, 3);

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(genieTheEverImpressive)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_TWO)).toBe(3);
  });
});
