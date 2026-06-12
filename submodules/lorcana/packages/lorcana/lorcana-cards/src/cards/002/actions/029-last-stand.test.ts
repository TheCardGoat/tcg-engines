import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { aladdinHeroicOutlaw, liloGalacticHero } from "../../001";
import { goofyKnightForADay } from "../../002";
import { lastStand } from "./029-last-stand";

describe("Last Stand", () => {
  it("banishes a character that was challenged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lastStand],
        inkwell: lastStand.cost,
        play: [liloGalacticHero],
      },
      {
        play: [{ card: goofyKnightForADay, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(liloGalacticHero, goofyKnightForADay),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(lastStand, {
        targets: [goofyKnightForADay],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(goofyKnightForADay)).toBeInZone("discard");
  });

  it("does not banish a character that was not involved in the challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lastStand],
        inkwell: lastStand.cost,
        play: [liloGalacticHero],
      },
      {
        play: [{ card: goofyKnightForADay, exerted: true }, aladdinHeroicOutlaw],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(liloGalacticHero, goofyKnightForADay),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(lastStand, {
        targets: [aladdinHeroicOutlaw],
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });

    expect(testEngine.getCard(aladdinHeroicOutlaw)).toBeInZone("play");
    expect(testEngine.getCard(lastStand)).toBeInZone("hand");
  });

  it("does not banish a character when no challenge occurred", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lastStand],
        inkwell: lastStand.cost,
      },
      {
        play: [goofyKnightForADay],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(lastStand, {
        targets: [goofyKnightForADay],
      }),
    ).toMatchObject({
      success: false,
      errorCode: "INVALID_ACTION_TARGET",
    });

    expect(testEngine.getCard(goofyKnightForADay)).toBeInZone("play");
    expect(testEngine.getCard(lastStand)).toBeInZone("hand");
  });
});
