import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { chienpoSnowWarrior } from "./074-chien-po-snow-warrior";

describe("Chien-Po - Snow Warrior", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(chienpoSnowWarrior.cost).toBe(7);
    expect(chienpoSnowWarrior.strength).toBe(7);
    expect(chienpoSnowWarrior.willpower).toBe(7);
    expect(chienpoSnowWarrior.lore).toBe(3);
    expect(chienpoSnowWarrior.inkable).toBe(true);
    expect(chienpoSnowWarrior.vanilla).toBe(true);
    expect(chienpoSnowWarrior.classifications).toEqual(["Storyborn", "Ally"]);
    expect(chienpoSnowWarrior.abilities).toEqual([]);

    const testEngine = new LorcanaTestEngine({
      play: [chienpoSnowWarrior],
    });

    const cardUnderTest = testEngine.getCardModel(chienpoSnowWarrior);
    expect(cardUnderTest.hasAbility).toBe(false);
    expect(cardUnderTest.canQuest()).toBe(true);
  });

  it("can be played onto the board", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [chienpoSnowWarrior],
      inkwell: chienpoSnowWarrior.cost,
    });

    expect(testEngine.asPlayerOne().playCard(chienpoSnowWarrior)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(chienpoSnowWarrior)).toBe("play");
  });
});
