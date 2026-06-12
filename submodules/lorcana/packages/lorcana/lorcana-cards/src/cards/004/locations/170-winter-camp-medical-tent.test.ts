import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { winterCampMedicalTent } from "./170-winter-camp-medical-tent";

const woundedHero = createMockCharacter({
  id: "winter-camp-hero",
  name: "Wounded Hero",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
  willpower: 6,
});

describe("Winter Camp - Medical Tent", () => {
  it("removes up to 4 damage from a Hero that quests here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        winterCampMedicalTent,
        { card: woundedHero, atLocation: winterCampMedicalTent, damage: 4 },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().quest(woundedHero)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(woundedHero)?.damage).toBe(0);
  });
});
