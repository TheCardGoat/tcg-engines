import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { hansNobleScoundrel } from "./148-hans-noble-scoundrel";

const princessAlly = createMockCharacter({
  id: "hans-noble-scoundrel-princess",
  name: "Princess Ally",
  cost: 2,
  classifications: ["Hero", "Princess"],
});

const ordinaryAlly = createMockCharacter({
  id: "hans-noble-scoundrel-ordinary",
  name: "Ordinary Ally",
  cost: 2,
  classifications: ["Hero"],
});

describe("Hans - Noble Scoundrel", () => {
  it("gains 1 lore when played if a Princess or Queen character is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hansNobleScoundrel],
      inkwell: hansNobleScoundrel.cost,
      play: [princessAlly],
      deck: [],
    });

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("does not gain lore when no Princess or Queen character is in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hansNobleScoundrel],
      inkwell: hansNobleScoundrel.cost,
      play: [ordinaryAlly],
      deck: [],
    });

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
    expect(testEngine.asPlayerOne().playCard(hansNobleScoundrel)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(0);
  });
});
