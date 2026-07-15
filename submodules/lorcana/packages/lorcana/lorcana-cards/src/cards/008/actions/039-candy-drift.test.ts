import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { candyDrift } from "./039-candy-drift";

describe("Candy Drift", () => {
  it("draws a card, buffs your chosen character, and banishes them at end of turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [candyDrift],
      inkwell: candyDrift.cost,
      play: [simbaProtectiveCub],
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
    });
    const playerOne = testEngine.asPlayerOne();

    expect(
      playerOne.playCard(candyDrift, { targets: [simbaProtectiveCub] }),
    ).toBeSuccessfulCommand();
    expect(playerOne.getZonesCardCount().hand).toBe(1);
    expect(playerOne.getCardStrength(simbaProtectiveCub)).toBe(simbaProtectiveCub.strength + 5);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(1);

    expect(playerOne.passTurn()).toBeSuccessfulCommand();
    expect(playerOne.getBagCount()).toBe(0);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(0);
    expect(playerOne.getCardZone(simbaProtectiveCub)).toBe("discard");
  });

  it("draws a card without a target for the rest of the effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [candyDrift],
      inkwell: candyDrift.cost,
      play: [],
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
    });
    const playerOne = testEngine.asPlayerOne();

    expect(playerOne.playCard(candyDrift)).toBeSuccessfulCommand();
    expect(playerOne.getZonesCardCount().hand).toBe(1);
    expect(testEngine.asServer().getState().G.triggeredAbilities.registrations).toHaveLength(0);
  });
});
