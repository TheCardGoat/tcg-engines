import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rabbitHunnyPaladin } from "./005-rabbit-hunny-paladin";

const hunnyAlly = createMockCharacter({
  id: "rabbit-hunny-paladin-hunny-ally",
  name: "Hunny Ally",
  cost: 2,
  strength: 2,
  classifications: ["Storyborn", "Hunny"],
});

describe("Rabbit - Hunny Paladin", () => {
  it("has Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rabbitHunnyPaladin],
    });

    expect(testEngine.asPlayerOne().hasKeyword(rabbitHunnyPaladin, "Bodyguard")).toBe(true);
  });

  it("gives a chosen Hunny character +1 lore when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [rabbitHunnyPaladin],
      inkwell: rabbitHunnyPaladin.cost,
      play: [hunnyAlly],
    });

    expect(testEngine.asPlayerOne().playCard(rabbitHunnyPaladin)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(rabbitHunnyPaladin, {
        targets: [hunnyAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(hunnyAlly)).toBe(hunnyAlly.lore + 1);
  });
});
