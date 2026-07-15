import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "@tcg/lorcana-engine";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { scarFieryUsurper } from "../../001/characters";
import { forceOfAGreatTyphoon } from "../../011/actions";
import { nextStopOlympus } from "./129-next-stop-olympus";

describe("Next Stop, Olympus", () => {
  it("costs 2 less to play when you control a character with 5 strength or more", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nextStopOlympus],
      inkwell: 0,
      play: [{ card: scarFieryUsurper, exerted: true }],
    });

    expect(testEngine.asPlayerOne().canPlayCard(nextStopOlympus)).toBe(true);
    expect(testEngine.asPlayerOne().playCardTo(nextStopOlympus, scarFieryUsurper).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne()).toBeReady(scarFieryUsurper);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
  });

  it("uses effective strength for the cost reduction check", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [forceOfAGreatTyphoon, nextStopOlympus],
      inkwell: forceOfAGreatTyphoon.cost,
      play: [simbaProtectiveCub],
    });

    expect(
      testEngine.asPlayerOne().playCard(forceOfAGreatTyphoon, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardStrength(simbaProtectiveCub)).toBe(
      simbaProtectiveCub.strength + 5,
    );
    expect(testEngine.asPlayerOne().canPlayCard(nextStopOlympus)).toBe(true);
    expect(testEngine.asPlayerOne().playCardTo(nextStopOlympus, simbaProtectiveCub).success).toBe(
      true,
    );
  });

  it("readies the chosen character, stops them from questing, and grants lore only on the next challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [nextStopOlympus],
        inkwell: 0,
        play: [{ card: scarFieryUsurper, exerted: true }],
      },
      {
        play: [
          { card: simbaProtectiveCub, exerted: true },
          { card: mickeyMouseTrueFriend, exerted: true },
        ],
      },
    );

    expect(testEngine.asPlayerOne().playCardTo(nextStopOlympus, scarFieryUsurper).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne()).toBeReady(scarFieryUsurper);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: scarFieryUsurper,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne()).toHaveGrantedAbility({
      card: scarFieryUsurper,
      ability: "gain-lore-when-challenging",
    });

    expect(testEngine.asPlayerOne().challenge(scarFieryUsurper, simbaProtectiveCub).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);

    testEngine
      .asServer()
      .manualReadyCard(
        testEngine.findCardInstanceId(scarFieryUsurper, "play", PLAYER_ONE) as CardInstanceId,
      );

    expect(
      testEngine.asPlayerOne().challenge(scarFieryUsurper, mickeyMouseTrueFriend).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
