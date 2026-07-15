import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { daisyDuckIsabel } from "./144-daisy-duck-isabel";

describe("Daisy Duck - Isabel", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(daisyDuckIsabel.cost).toBe(3);
    expect(daisyDuckIsabel.strength).toBe(2);
    expect(daisyDuckIsabel.willpower).toBe(2);
    expect(daisyDuckIsabel.lore).toBe(3);
    expect(daisyDuckIsabel.inkable).toBe(true);
    expect(daisyDuckIsabel.vanilla).toBe(true);
    expect(daisyDuckIsabel.classifications).toEqual(["Storyborn", "Ally"]);
    expect(daisyDuckIsabel.abilities).toBeUndefined();

    const testEngine = new LorcanaTestEngine({
      play: [daisyDuckIsabel],
    });

    const cardUnderTest = testEngine.getCardModel(daisyDuckIsabel);
    expect(cardUnderTest.hasAbility).toBe(false);
    expect(cardUnderTest.canQuest()).toBe(true);
  });

  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [daisyDuckIsabel],
      inkwell: daisyDuckIsabel.cost,
    });

    expect(testEngine.asPlayerOne().playCard(daisyDuckIsabel)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(daisyDuckIsabel)).toBe("play");
  });
});
