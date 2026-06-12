import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  goofyMusketeer,
  jetsamUrsulasSpy,
  liloMakingAWish,
  stitchNewDog,
  tiggerWonderfulThing,
} from "../../001";
import { strengthOfARagingFire } from "./201-strength-of-a-raging-fire";

describe("Strength of a Raging Fire", () => {
  it("Deal damage to chosen character equal to the number of characters you have in play.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: strengthOfARagingFire.cost,
      hand: [strengthOfARagingFire],
      play: [
        { card: goofyMusketeer },
        { card: liloMakingAWish },
        { card: stitchNewDog },
        { card: tiggerWonderfulThing },
      ],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(strengthOfARagingFire, goofyMusketeer),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveDamage({ card: goofyMusketeer, value: 4 });
  });

  it("deals 1 damage when you have 1 character in play", () => {
    const cardsInPlay = [arielOnHumanLegs];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strengthOfARagingFire],
      inkwell: strengthOfARagingFire.cost,
      play: cardsInPlay,
    });
    const targetId = testEngine.findCardInstanceId(arielOnHumanLegs, "play");

    const playResult = testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
      targets: [targetId],
    });
    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(1);
  });

  it("deals 3 damage when you have 3 characters in play - using different cards", () => {
    const cardsInPlay = [arielOnHumanLegs, jetsamUrsulasSpy, liloMakingAWish];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strengthOfARagingFire],
      inkwell: strengthOfARagingFire.cost,
      play: cardsInPlay,
    });
    const targetId = testEngine.findCardInstanceId(liloMakingAWish, "play");

    const playResult = testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
      targets: [targetId],
    });
    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(liloMakingAWish)).toBe("discard");
  });

  it("deals 4 damage when you have 4 characters in play - using different cards", () => {
    const cardsInPlay = [arielOnHumanLegs, jetsamUrsulasSpy, liloMakingAWish, stitchNewDog];
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [strengthOfARagingFire],
      inkwell: strengthOfARagingFire.cost,
      play: cardsInPlay,
    });
    const targetId = testEngine.findCardInstanceId(stitchNewDog, "play");

    const playResult = testEngine.asPlayerOne().playCard(strengthOfARagingFire, {
      targets: [targetId],
    });
    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(stitchNewDog)).toBe("discard");
  });
});
