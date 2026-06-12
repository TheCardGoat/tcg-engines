import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { moanaChosenByTheOcean } from "../../001";
import { oneLastHope } from "./197-one-last-hope";

describe("One Last Hope", () => {
  it("gives a Hero Resist +2 and lets them challenge ready characters this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [oneLastHope],
      inkwell: oneLastHope.cost,
      play: [moanaChosenByTheOcean],
    });

    expect(
      testEngine.asPlayerOne().playCard(oneLastHope, { targets: [moanaChosenByTheOcean] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(moanaChosenByTheOcean, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(moanaChosenByTheOcean, "can-challenge-ready")).toBe(true);
  });
});
