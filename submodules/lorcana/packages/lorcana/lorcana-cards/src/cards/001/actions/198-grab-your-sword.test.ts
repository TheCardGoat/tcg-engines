import { describe, expect, it } from "bun:test";
import { jetsamUrsulasSpy } from "../characters/046-jetsam-ursulas-spy";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { grabYourSword } from "./198-grab-your-sword";
import { arielOnHumanLegs, jasperCommonCrook } from "../characters";

const songSinger = createMockCharacter({
  id: "grab-your-sword-singer",
  name: "Grab Your Sword Singer",
  cost: 5,
  strength: 2,
  willpower: 4,
});

describe("Grab Your Sword", () => {
  it("Deal 2 damage to each opposing character.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourSword],
        inkwell: grabYourSword.cost,
        play: [jetsamUrsulasSpy],
      },
      {
        play: [arielOnHumanLegs, jasperCommonCrook],
      },
    );

    // Grab your sword doesn't prompt the user for a target, and it's not an optional effect. So it resolves automatically.
    testEngine.asPlayerOne().playCard(grabYourSword);

    // Only deals damage to opposing characters, so jetsam Ursula's Spy should not take any damage, but the other two characters should take 2 damage each.
    expect(testEngine.asPlayerOne().getDamage(jetsamUrsulasSpy)).toEqual(0);
    expect(testEngine.asPlayerOne().getDamage(arielOnHumanLegs)).toEqual(2);
    expect(testEngine.asPlayerOne().getDamage(jasperCommonCrook)).toEqual(2);
  });

  it("can be sung by an eligible character instead of paying ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [grabYourSword],
        play: [songSinger],
      },
      {
        play: [arielOnHumanLegs, jasperCommonCrook],
      },
    );

    const result = testEngine.asPlayerOne().singSong(grabYourSword, songSinger);

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(grabYourSword)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(songSinger)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(songSinger)).toBe(true);
    expect(testEngine.asPlayerTwo().getDamage(arielOnHumanLegs)).toEqual(2);
    expect(testEngine.asPlayerTwo().getDamage(jasperCommonCrook)).toEqual(2);
  });
});
