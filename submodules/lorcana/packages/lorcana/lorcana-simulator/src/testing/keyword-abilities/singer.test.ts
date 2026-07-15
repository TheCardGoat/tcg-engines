import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import {
  arielOnHumanLegs,
  arielSpectacularSinger,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import {
  isabelaMadrigalInTheMoment,
  restoringTheHeart,
  theFamilyMadrigal,
  thisIsMyFamily,
} from "@tcg/lorcana-cards/cards/007";

describe("Singer - Ariel, Spectacular Singer - Singer 5 (This character counts as cost 5 to sing songs.)", () => {
  it("Singer lets a character pay a song's alternate cost by exerting", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theFamilyMadrigal],
      play: [arielSpectacularSinger],
      inkwell: 0,
      deck: [
        arielOnHumanLegs,
        thisIsMyFamily,
        isabelaMadrigalInTheMoment,
        simbaProtectiveCub,
        restoringTheHeart,
      ],
    });

    expect(
      testEngine.asPlayerOne().singSong(theFamilyMadrigal, arielSpectacularSinger),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(arielSpectacularSinger)).toBe(true);
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(testEngine.asPlayerOne().getPendingEffects()[0]).toEqual(
      expect.objectContaining({
        type: "scry-selection",
      }),
    );
  });

  it.todo("Singer can't sing if the character is drying (just played this turn)", () => {});

  it.todo("Singer value must meet or exceed the song's cost to sing it", () => {});

  it.todo("Singer can't sing if the character is already exerted", () => {});
});
