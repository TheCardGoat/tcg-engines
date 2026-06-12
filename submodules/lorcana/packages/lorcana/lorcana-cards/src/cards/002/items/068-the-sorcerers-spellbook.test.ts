import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { theSorcerersSpellbook } from "./068-the-sorcerers-spellbook";

describe("The Sorcerer's Spellbook", () => {
  it("gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [theSorcerersSpellbook],
    });

    const result = testEngine.asPlayerOne().activateAbility(theSorcerersSpellbook);

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });
});
