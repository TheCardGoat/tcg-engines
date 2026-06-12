import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { cogsworthGrandfatherClock } from "../../002";
import { tipoGrowingSon } from "../../005";
import { heffalumpsAndWoozles } from "./095-heffalumps-and-woozles";

describe("Heffalumps and Woozles", () => {
  it("stops the chosen opposing character from questing during their next turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heffalumpsAndWoozles],
        inkwell: heffalumpsAndWoozles.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [tipoGrowingSon, tipoGrowingSon],
        play: [tipoGrowingSon],
      },
    );
    const tipoId = testEngine.findCardInstanceId(tipoGrowingSon, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(heffalumpsAndWoozles, {
        targets: [tipoId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);

    testEngine.asServer().passTurn();
    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: tipoGrowingSon,
      restriction: "cant-quest",
    });

    testEngine.asServer().passTurn();
    expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
      card: tipoGrowingSon,
      restriction: "cant-quest",
    });
  });

  it("still draws a card when there is no opposing character to choose", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [heffalumpsAndWoozles],
      inkwell: heffalumpsAndWoozles.cost,
      deck: [simbaProtectiveCub],
    });

    expect(testEngine.asPlayerOne().playCard(heffalumpsAndWoozles)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });

  it("still draws a card when the only opposing character has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heffalumpsAndWoozles],
        inkwell: heffalumpsAndWoozles.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [cogsworthGrandfatherClock],
      },
    );
    const cogsworthId = testEngine.findCardInstanceId(
      cogsworthGrandfatherClock,
      "play",
      PLAYER_TWO,
    );

    expect(testEngine.asPlayerOne().playCard(heffalumpsAndWoozles)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(cogsworthId)).toBe("play");
    expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
      card: cogsworthGrandfatherClock,
      restriction: "cant-quest",
    });
  });

  it("regression: restriction lasts through opponent's next turn and then expires", () => {
    // Bug: Heffalumps and Woozles was not preventing quest until next turn.
    // The first test already covers the core behavior - this verifies the same
    // with explicit pass/check pattern.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heffalumpsAndWoozles],
        inkwell: heffalumpsAndWoozles.cost,
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [tipoGrowingSon, tipoGrowingSon],
        play: [tipoGrowingSon],
      },
    );
    const tipoId = testEngine.findCardInstanceId(tipoGrowingSon, "play", PLAYER_TWO);

    expect(
      testEngine.asPlayerOne().playCard(heffalumpsAndWoozles, {
        targets: [tipoId],
      }).success,
    ).toBe(true);

    // Pass to player two's turn using asPlayerOne - same pattern as first test
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Tipo should have the restriction during opponent's turn
    expect(testEngine.asPlayerTwo()).toHaveRestriction({
      card: tipoGrowingSon,
      restriction: "cant-quest",
    });

    // Pass back to player one's turn
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Restriction should now be expired
    expect(testEngine.asPlayerTwo()).not.toHaveRestriction({
      card: tipoGrowingSon,
      restriction: "cant-quest",
    });
  });
});
