import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arthurTrainedSwordsman,
  cheshireCatAlwaysGrinning,
  feliciaAlwaysHungry,
  flynnRiderConfidentVagabond,
  littleJohnLoyalFriend,
  rabbitReluctantHost,
  ratiganCriminalMastermind,
} from "../characters";
import { fangCrossbow, pawpsicle } from "../items";
import { zeroToHero } from "./032-zero-to-hero";

describe("Zero to Hero", () => {
  it("reduces the next character by the number of your characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [zeroToHero, feliciaAlwaysHungry],
      inkwell: zeroToHero.cost,
      play: [pawpsicle, arthurTrainedSwordsman],
    });

    expect(testEngine.asPlayerOne().playCard(zeroToHero)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(feliciaAlwaysHungry)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(feliciaAlwaysHungry)).toBe("play");
  });

  it("can fully discount a larger character when you already control enough characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [zeroToHero, rabbitReluctantHost],
      inkwell: zeroToHero.cost,
      play: [
        pawpsicle,
        fangCrossbow,
        arthurTrainedSwordsman,
        cheshireCatAlwaysGrinning,
        flynnRiderConfidentVagabond,
        littleJohnLoyalFriend,
        ratiganCriminalMastermind,
      ],
    });

    expect(testEngine.asPlayerOne().playCard(zeroToHero)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(rabbitReluctantHost)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(rabbitReluctantHost)).toBe("play");
  });
});
