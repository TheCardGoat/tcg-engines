import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { jumbaJookibaCriticalScientist } from "./173-jumba-jookiba-critical-scientist";

describe("Jumba Jookiba - Critical Scientist", () => {
  it("is a vanilla 4/1/6/2 character", () => {
    expect(jumbaJookibaCriticalScientist.cost).toBe(4);
    expect(jumbaJookibaCriticalScientist.strength).toBe(1);
    expect(jumbaJookibaCriticalScientist.willpower).toBe(6);
    expect(jumbaJookibaCriticalScientist.lore).toBe(2);
    expect(jumbaJookibaCriticalScientist.vanilla).toBe(true);
  });

  it("can quest for 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [jumbaJookibaCriticalScientist],
      deck: 5,
    });

    const loreBefore = testEngine.asPlayerOne().getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().quest(jumbaJookibaCriticalScientist)).toBeSuccessfulCommand();
    const loreAfter = testEngine.asPlayerOne().getLore(PLAYER_ONE);

    expect(loreAfter).toBe(loreBefore + 2);
  });
});
