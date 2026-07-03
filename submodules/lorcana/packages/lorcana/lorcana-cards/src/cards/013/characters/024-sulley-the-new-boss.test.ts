import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { sulleyTheNewBoss } from "./024-sulley-the-new-boss";

const rehiredCharacter = createMockCharacter({
  id: "sulley-new-boss-rehired-character",
  name: "Rehired Character",
  cost: 2,
});

describe("Sulley - The New Boss", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sulleyTheNewBoss],
    });

    expect(testEngine.asPlayerOne().hasKeyword(sulleyTheNewBoss, "Bodyguard")).toBe(true);
  });

  it("may return a character from discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sulleyTheNewBoss],
      discard: [rehiredCharacter],
      inkwell: sulleyTheNewBoss.cost,
    });

    expect(testEngine.asPlayerOne().playCard(sulleyTheNewBoss)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sulleyTheNewBoss, {
        resolveOptional: true,
        targets: [rehiredCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(rehiredCharacter)).toBe("hand");
  });
});
