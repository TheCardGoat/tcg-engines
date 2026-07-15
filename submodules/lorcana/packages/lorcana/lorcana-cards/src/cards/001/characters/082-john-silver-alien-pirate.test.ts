import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from ".";
import { johnSilverAlienPirate } from "./082-john-silver-alien-pirate";

describe("John Silver - Alien Pirate", () => {
  it("triggers from both being played and questing", () => {
    const playTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [johnSilverAlienPirate],
        inkwell: johnSilverAlienPirate.cost,
        deck: 3,
      },
      {
        play: [simbaProtectiveCub],
        deck: 3,
      },
    );
    const simbaId = playTriggerEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(playTriggerEngine.asPlayerOne().playCard(johnSilverAlienPirate)).toBeSuccessfulCommand();
    expect(playTriggerEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      playTriggerEngine.asPlayerOne().resolvePendingByCard(johnSilverAlienPirate, {
        targets: [simbaId],
      }).success,
    ).toBe(true);
    expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

    expect(playTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(true);
    expect(
      playTriggerEngine.executeMoveForView("authoritative", "manualPassTurn", {
        args: {},
      }).success,
    ).toBe(true);
    expect(playTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);

    const questTriggerEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [johnSilverAlienPirate],
        deck: 3,
      },
      {
        play: [simbaProtectiveCub],
        deck: 3,
      },
    );
    const laterSimbaId = questTriggerEngine.findCardInstanceId(
      simbaProtectiveCub,
      "play",
      PLAYER_TWO,
    );

    expect(questTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(questTriggerEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(questTriggerEngine.asPlayerOne().quest(johnSilverAlienPirate)).toBeSuccessfulCommand();
    expect(questTriggerEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      questTriggerEngine.asPlayerOne().resolvePendingByCard(johnSilverAlienPirate, {
        targets: [laterSimbaId],
      }).success,
    ).toBe(true);
    expect(questTriggerEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(questTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(true);
    expect(
      questTriggerEngine.executeMoveForView("authoritative", "manualPassTurn", {
        args: {},
      }).success,
    ).toBe(true);
    expect(questTriggerEngine.asPlayerTwo().getCard(simbaProtectiveCub)?.hasReckless).toBe(false);
  });
});
