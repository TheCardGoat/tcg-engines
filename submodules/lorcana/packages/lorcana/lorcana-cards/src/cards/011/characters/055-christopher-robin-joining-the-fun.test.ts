import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { christopherRobinJoiningTheFun } from "./055-christopher-robin-joining-the-fun";

describe("Christopher Robin - Joining the Fun", () => {
  it("costs 1 less on player two's first turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 5,
      },
      {
        inkwell: christopherRobinJoiningTheFun.cost - 1,
        hand: [christopherRobinJoiningTheFun],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(christopherRobinJoiningTheFun),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(christopherRobinJoiningTheFun)).toBe("play");
  });

  it("does not get the discount for the first player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: christopherRobinJoiningTheFun.cost - 1,
      hand: [christopherRobinJoiningTheFun],
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(christopherRobinJoiningTheFun),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(christopherRobinJoiningTheFun)).toBe("hand");
  });

  it("requires the full cost for the first player", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: christopherRobinJoiningTheFun.cost,
      hand: [christopherRobinJoiningTheFun],
      deck: 5,
    });

    expect(
      testEngine.asPlayerOne().playCard(christopherRobinJoiningTheFun),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(christopherRobinJoiningTheFun)).toBe("play");
  });

  it("still cannot be played without enough ink after the discount", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 5,
      },
      {
        inkwell: 0,
        hand: [christopherRobinJoiningTheFun],
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(christopherRobinJoiningTheFun),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(christopherRobinJoiningTheFun)).toBe("hand");
  });
});
