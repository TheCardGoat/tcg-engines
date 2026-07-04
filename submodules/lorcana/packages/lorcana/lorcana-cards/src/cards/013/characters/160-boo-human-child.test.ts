import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { booHumanChild } from "./160-boo-human-child";

describe("Boo - Human Child", () => {
  it("gets +2 lore while you have 5 or more cards in your inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [booHumanChild],
      inkwell: 5,
    });

    expect(testEngine.asPlayerOne().getCardLore(booHumanChild)).toBe(3);
  });
});
