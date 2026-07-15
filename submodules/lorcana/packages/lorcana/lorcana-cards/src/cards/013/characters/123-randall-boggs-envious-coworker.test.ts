import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { randallBoggsEnviousCoworker } from "./123-randall-boggs-envious-coworker";

const inkCard = createMockCharacter({
  id: "randall-envious-ink-card",
  name: "Ink Card",
  cost: 1,
});

describe("Randall Boggs - Envious Coworker", () => {
  it("has Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [randallBoggsEnviousCoworker],
    });

    expect(testEngine.asPlayerOne().hasKeyword(randallBoggsEnviousCoworker, "Evasive")).toBe(true);
  });

  it("gets +2 lore while all cards in your inkwell are exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [randallBoggsEnviousCoworker],
      inkwell: [{ card: inkCard, exerted: true }],
    });

    expect(testEngine.asPlayerOne().getCardLore(randallBoggsEnviousCoworker)).toBe(2);
  });

  it("does not get +2 lore while a card in your inkwell is ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [randallBoggsEnviousCoworker],
      inkwell: [{ card: inkCard, exerted: false }],
    });

    expect(testEngine.asPlayerOne().getCardLore(randallBoggsEnviousCoworker)).toBe(0);
  });
});
