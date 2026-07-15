import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { angelSirenSinger, whiteRabbitLateAgain } from "@tcg/lorcana-cards/cards/011";

describe("UNDERDOG keyword", () => {
  it("reduces play cost by 1 for the non-starting player on their first turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 5 },
      {
        hand: [angelSirenSinger],
        inkwell: angelSirenSinger.cost - 1,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().playCard(angelSirenSinger)).toBeSuccessfulCommand();
  });

  it("does not reduce cost for the starting player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [angelSirenSinger],
      inkwell: angelSirenSinger.cost - 1,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(angelSirenSinger).success).toBe(false);
  });

  it("does not reduce cost after the non-starting player's first turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 5 },
      {
        hand: [whiteRabbitLateAgain],
        inkwell: whiteRabbitLateAgain.cost - 1,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().playCard(whiteRabbitLateAgain).success).toBe(false);
  });
});
