import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { antonioMadrigalAnimalExpert } from "./035-antonio-madrigal-animal-expert";

describe("Antonio Madrigal - Animal Expert", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(antonioMadrigalAnimalExpert.cost).toBe(3);
    expect(antonioMadrigalAnimalExpert.strength).toBe(3);
    expect(antonioMadrigalAnimalExpert.willpower).toBe(4);
    expect(antonioMadrigalAnimalExpert.lore).toBe(1);
    expect(antonioMadrigalAnimalExpert.inkable).toBe(true);
    expect(antonioMadrigalAnimalExpert.vanilla).toBe(true);
    expect(antonioMadrigalAnimalExpert.classifications).toEqual(["Storyborn", "Ally", "Madrigal"]);

    const testEngine = new LorcanaTestEngine({
      play: [antonioMadrigalAnimalExpert],
    });

    const cardUnderTest = testEngine.getCardModel(antonioMadrigalAnimalExpert);
    expect(cardUnderTest.hasAbility).toBe(false);
    expect(cardUnderTest.canQuest()).toBe(true);
  });

  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [antonioMadrigalAnimalExpert],
      inkwell: antonioMadrigalAnimalExpert.cost,
    });

    expect(testEngine.asPlayerOne().playCard(antonioMadrigalAnimalExpert)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(antonioMadrigalAnimalExpert)).toBe("play");
  });
});
