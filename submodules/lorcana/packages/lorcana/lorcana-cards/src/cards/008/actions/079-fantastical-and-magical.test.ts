import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend } from "../../001";
import {
  generalLiHeadOfTheImperialArmy,
  jumbaJookibaCriticalScientist,
  khanWarHorse,
} from "../characters";
import { fantasticalAndMagical } from "./079-fantastical-and-magical";

describe("Fantastical and Magical", () => {
  it("draws a card and gains 1 lore for each character that sang the song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fantasticalAndMagical],
      deck: [mickeyMouseTrueFriend, mickeyMouseTrueFriend, mickeyMouseTrueFriend],
      play: [generalLiHeadOfTheImperialArmy, jumbaJookibaCriticalScientist, khanWarHorse],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(fantasticalAndMagical, [
          generalLiHeadOfTheImperialArmy,
          jumbaJookibaCriticalScientist,
          khanWarHorse,
        ]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });
});
