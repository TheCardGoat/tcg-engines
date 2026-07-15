import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { nobodyLikeU } from "./035-nobody-like-u";

const nobodySingerA = createMockCharacter({
  id: "nobody-like-u-singer-a",
  name: "Nobody Singer A",
  cost: 2,
});

const nobodySingerB = createMockCharacter({
  id: "nobody-like-u-singer-b",
  name: "Nobody Singer B",
  cost: 3,
});

const freeCharacter = createMockCharacter({
  id: "nobody-like-u-free-character",
  name: "Free Character",
  cost: 4,
});

describe("Nobody Like U", () => {
  it("can be played via Sing Together 5", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nobodyLikeU, freeCharacter],
      play: [nobodySingerA, nobodySingerB],
    });

    expect(
      testEngine.asPlayerOne().playSongTogether(nobodyLikeU, [nobodySingerA, nobodySingerB]),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(nobodySingerA)).toBe(true);
    expect(testEngine.asPlayerOne().isExerted(nobodySingerB)).toBe(true);
  });

  it("plays a character with cost 4 or less for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [nobodyLikeU, freeCharacter],
      inkwell: nobodyLikeU.cost,
    });
    const freeCharacterId = testEngine.findCardInstanceId(freeCharacter, "hand", "p1");

    expect(
      testEngine.asPlayerOne().playCard(nobodyLikeU, {
        targets: [freeCharacterId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(freeCharacter)).toBe("play");
  });
});
