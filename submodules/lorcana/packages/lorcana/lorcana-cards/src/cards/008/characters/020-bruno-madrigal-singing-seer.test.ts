import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { brunoMadrigalSingingSeer } from "./020-bruno-madrigal-singing-seer";

const supportingCharacterOne = createMockCharacter({
  id: "bruno-singing-seer-support-one",
  name: "Support Character One",
  cost: 1,
});

const supportingCharacterTwo = createMockCharacter({
  id: "bruno-singing-seer-support-two",
  name: "Support Character Two",
  cost: 1,
});

const songToSing = createMockSong({
  id: "bruno-singing-seer-song",
  name: "Song To Sing",
  cost: 5,
  text: "A test song Bruno can sing.",
});

const drawnCardOne = createMockCharacter({
  id: "bruno-singing-seer-drawn-one",
  name: "Drawn Card One",
  cost: 1,
});

const drawnCardTwo = createMockCharacter({
  id: "bruno-singing-seer-drawn-two",
  name: "Drawn Card Two",
  cost: 1,
});

const drawnCardThree = createMockCharacter({
  id: "bruno-singing-seer-drawn-three",
  name: "Drawn Card Three",
  cost: 1,
});

describe("Bruno Madrigal - Singing Seer", () => {
  it("draws a card for each character you have in play when he sings a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: brunoMadrigalSingingSeer, isDrying: false },
        supportingCharacterOne,
        supportingCharacterTwo,
      ],
      hand: [songToSing],
      deck: [drawnCardOne, drawnCardTwo, drawnCardThree],
    });

    expect(
      testEngine.asPlayerOne().singSong(songToSing, brunoMadrigalSingingSeer),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(brunoMadrigalSingingSeer, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
      hand: 3,
      deck: 0,
      discard: 1,
      play: 3,
    });
    expect(testEngine.asPlayerOne().getCardZone(drawnCardOne)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnCardTwo)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(drawnCardThree)).toBe("hand");
  });
});
