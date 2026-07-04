import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { _4townHottestBandOfTheYear } from "./017-4town-hottest-band-of-the-year";

const helperSinger = createMockCharacter({
  id: "4town-helper-singer",
  name: "Helper Singer",
  cost: 1,
});

const singTogetherSong = createMockSong({
  id: "4town-sing-together-song",
  name: "Sing Together Song",
  cost: 6,
  text: "A Sing Together song.",
  abilities: [{ type: "keyword", keyword: "SingTogether", value: 6 }],
});

const ordinarySong = createMockSong({
  id: "4town-ordinary-song",
  name: "Ordinary Song",
  cost: 5,
  text: "A song without Sing Together.",
});

const drawnCard = createMockCharacter({
  id: "4town-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("4*Town - Hottest Band of the Year", () => {
  it("draws a card when it sings a song with Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [singTogetherSong],
      play: [
        { card: _4townHottestBandOfTheYear, isDrying: false },
        { card: helperSinger, isDrying: false },
      ],
      deck: [drawnCard],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playSongTogether(singTogetherSong, [_4townHottestBandOfTheYear, helperSinger]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
  });

  it("does not draw a card when it sings a song without Sing Together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ordinarySong],
      play: [{ card: _4townHottestBandOfTheYear, isDrying: false }],
      deck: [drawnCard],
    });

    expect(
      testEngine.asPlayerOne().singSong(ordinarySong, _4townHottestBandOfTheYear),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
  });
});
