import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import {
  mickeyMouseTrueFriend,
  moanaChosenByTheOcean,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../001";
import { goofyKnightForADay } from "../../002";
import { i2i } from "./130-i2i";

describe("I2I", () => {
  it("makes each player draw 2 cards and gain 2 lore on a normal cast", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [i2i],
        inkwell: i2i.cost,
        deck: [moanaChosenByTheOcean, simbaProtectiveCub],
      },
      {
        deck: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(i2i)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(2);
    expect(testEngine.getLore("player_one")).toBe(2);
    expect(testEngine.getLore("player_two")).toBe(2);
  });

  it("regression: active player wins when both players reach 20 lore simultaneously", () => {
    // Bug: When I2I gives both players 2 lore and both reach 20, the active player's
    // triggers should resolve first, giving them the win.
    // Expected: Active player (player one who played I2I) wins.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [i2i],
        inkwell: i2i.cost,
        lore: 18,
        deck: [moanaChosenByTheOcean, simbaProtectiveCub],
      },
      {
        lore: 18,
        deck: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    expect(testEngine.asPlayerOne().playCard(i2i)).toBeSuccessfulCommand();

    // Both players gain 2 lore, reaching 20
    // Active player (player one) should win because their triggers resolve first
    expect(testEngine.getLore(PLAYER_ONE)).toBe(20);
    expect(testEngine.getLore(PLAYER_TWO)).toBe(20);

    // The game should be over with player one (the active player) as the winner
    const state = testEngine.getAuthoritativeState();
    expect(state.ctx.status.gameEnded).toBe(true);
    expect(state.ctx.status.winner).toBe(PLAYER_ONE);
  });

  it("regression: readies BOTH characters when sung by two characters", () => {
    // Bug: I2I was not readying both characters when sung by two characters.
    // Both singers should be readied after the song resolves.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [i2i],
        play: [moanaChosenByTheOcean, tinkerBellPeterPansAlly],
        deck: [simbaProtectiveCub, simbaProtectiveCub],
      },
      {
        deck: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(i2i, [moanaChosenByTheOcean, tinkerBellPeterPansAlly]).success,
    ).toBe(true);

    // Both singers should be readied (not exerted)
    expect(testEngine.asPlayerOne().isExerted(moanaChosenByTheOcean)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(tinkerBellPeterPansAlly)).toBe(false);
  });

  it("readies the singers and stops them from questing when sung together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [i2i],
        play: [moanaChosenByTheOcean, tinkerBellPeterPansAlly],
      },
      {
        deck: [goofyKnightForADay, mickeyMouseTrueFriend],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(i2i, [moanaChosenByTheOcean, tinkerBellPeterPansAlly]).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(moanaChosenByTheOcean)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(tinkerBellPeterPansAlly)).toBe(false);
    expect(testEngine.hasRestriction(moanaChosenByTheOcean, "cant-quest")).toBe(true);
    expect(testEngine.hasRestriction(tinkerBellPeterPansAlly, "cant-quest")).toBe(true);
  });
});
