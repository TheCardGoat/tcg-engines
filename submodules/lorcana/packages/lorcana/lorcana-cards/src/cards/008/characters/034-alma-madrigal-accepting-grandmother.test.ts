import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { almaMadrigalAcceptingGrandmother } from "./034-alma-madrigal-accepting-grandmother";

const singerA = createMockCharacter({
  id: "alma-singer-a",
  name: "Singer A",
  cost: 5,
});

const singerB = createMockCharacter({
  id: "alma-singer-b",
  name: "Singer B",
  cost: 5,
});

const singerC = createMockCharacter({
  id: "alma-singer-c",
  name: "Singer C",
  cost: 3,
});

const songToSing = createMockSong({
  id: "alma-test-song",
  name: "Test Song",
  cost: 3,
  text: "A test song for Alma.",
  abilities: [{ keyword: "SingTogether", type: "keyword", value: 5 }],
});

const secondSong = createMockSong({
  id: "alma-test-second-song",
  name: "Second Song",
  cost: 3,
  text: "A second test song for Alma.",
  abilities: [],
});

describe("Alma Madrigal - Accepting Grandmother", () => {
  it("THE MIRACLE IS YOU - readies characters after they sing a song (single singer)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songToSing],
      inkwell: songToSing.cost,
      play: [
        { card: almaMadrigalAcceptingGrandmother, isDrying: false },
        { card: singerA, isDrying: false },
      ],
    });

    expect(testEngine.asPlayerOne().singSong(songToSing, singerA)).toBeSuccessfulCommand();

    // Singer should be exerted after singing
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(true);

    // The triggered ability should create a bag for the optional effect
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional ability to ready the singer
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalAcceptingGrandmother),
    ).toBeSuccessfulCommand();

    // Singer should now be ready after the ability resolves
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(false);
  });

  it("THE MIRACLE IS YOU - readies all singers when multiple characters sing together", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songToSing],
      play: [
        { card: almaMadrigalAcceptingGrandmother, isDrying: false },
        { card: singerA, isDrying: false },
        { card: singerB, isDrying: false },
        { card: singerC, isDrying: false },
      ],
    });

    // singerA (3) + singerB (3) = 6 >= cost 5
    expect(
      testEngine.asPlayerOne().playSongTogether(songToSing, [singerA, singerB]),
    ).toBeSuccessfulCommand();

    // Singers should be exerted after singing
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(singerB)).toBe(true);

    // The triggered ability should create a bag
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional ability
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalAcceptingGrandmother),
    ).toBeSuccessfulCommand();

    // Both singers should now be ready
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(singerB)).toBe(false);
    // Non-singer should still be ready (was never exerted)
    expect(testEngine.asPlayerOne().isExerted(singerC)).toBe(false);
  });

  it("THE MIRACLE IS YOU - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songToSing, secondSong],
      inkwell: songToSing.cost + secondSong.cost,
      play: [
        { card: almaMadrigalAcceptingGrandmother, isDrying: false },
        { card: singerA, isDrying: false },
      ],
    });

    // First song
    expect(testEngine.asPlayerOne().singSong(songToSing, singerA)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Accept the optional ability
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalAcceptingGrandmother),
    ).toBeSuccessfulCommand();

    // Singer should be ready after the first resolve
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(false);

    // Second song - should NOT trigger since it's once per turn
    expect(testEngine.asPlayerOne().singSong(secondSong, singerA)).toBeSuccessfulCommand();

    // No new bag should be created
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

    // Singer stays exerted from the second singing
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(true);
  });

  it("regression: only readies the singing characters, not ALL characters", () => {
    const nonSinger = createMockCharacter({
      id: "alma-non-singer",
      name: "Non-Singer",
      cost: 4,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [songToSing],
      inkwell: songToSing.cost,
      play: [
        { card: almaMadrigalAcceptingGrandmother, isDrying: false },
        { card: singerA, isDrying: false },
        { card: nonSinger, isDrying: false },
      ],
    });

    // Manually exert the non-singer so we can verify it does NOT get readied
    const nonSingerId = testEngine.findCardInstanceId(nonSinger, "play", "player_one");
    testEngine.asServer().manualExertCard(nonSingerId);
    expect(testEngine.asPlayerOne().isExerted(nonSinger)).toBe(true);

    expect(testEngine.asPlayerOne().singSong(songToSing, singerA)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(almaMadrigalAcceptingGrandmother),
    ).toBeSuccessfulCommand();

    // Singer should be readied
    expect(testEngine.asPlayerOne().isExerted(singerA)).toBe(false);
    // Non-singer should remain exerted - Alma only readies the singers, not ALL characters
    expect(testEngine.asPlayerOne().isExerted(nonSinger)).toBe(true);
  });
});
