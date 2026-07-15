import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { winnieThePoohHunnyArchmage } from "./040-winnie-the-pooh-hunny-archmage";

const firstHunny = createMockCharacter({
  id: "pooh-archmage-first-hunny",
  name: "First Hunny",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

const secondHunny = createMockCharacter({
  id: "pooh-archmage-second-hunny",
  name: "Second Hunny",
  cost: 1,
  classifications: ["Storyborn", "Hunny"],
});

describe("Winnie the Pooh - Hunny Archmage", () => {
  it("gets +2 lore while you have two other Hunny characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [winnieThePoohHunnyArchmage, firstHunny, secondHunny],
    });

    expect(testEngine.asPlayerOne().getCardLore(winnieThePoohHunnyArchmage)).toBe(
      winnieThePoohHunnyArchmage.lore + 2,
    );
  });
});
