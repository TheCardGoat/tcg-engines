import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaChosenByTheOcean } from "../../001";
import { oneLastHopeEpic } from "./222-one-last-hope-epic";

describe("One Last Hope Epic", () => {
  it("gives a Hero Resist +2 and lets them challenge ready characters this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneLastHopeEpic],
      inkwell: oneLastHopeEpic.cost,
      play: [moanaChosenByTheOcean],
    });

    expect(
      testEngine.asPlayerOne().playCard(oneLastHopeEpic, {
        targets: [moanaChosenByTheOcean],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getKeywordValue(moanaChosenByTheOcean, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(moanaChosenByTheOcean, "can-challenge-ready")).toBe(true);
  });
});
