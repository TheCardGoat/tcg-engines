import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { amberChromicon, healingDecanter, queensSensorCore } from "../items";
import { royalTantrum } from "./161-royal-tantrum";

describe("Royal Tantrum", () => {
  it("banishes the chosen items and draws a card for each item banished this way", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [royalTantrum],
      inkwell: royalTantrum.cost,
      deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      play: [amberChromicon, healingDecanter, queensSensorCore],
    });

    expect(
      testEngine.asPlayerOne().playCard(royalTantrum, {
        targets: [amberChromicon, healingDecanter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(amberChromicon)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(healingDecanter)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(queensSensorCore)).toBe("play");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, deck: 0, play: 1, discard: 3 });
  });
});
