import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { beastGraciousPrinceEnchanted } from "./224-beast-gracious-prince-enchanted";
import { arielOnHumanLegs } from "../../001/characters/001-ariel-on-human-legs";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";

describe("Beast - Gracious Prince Enchanted", () => {
  it("FULL DANCE CARD - Your Princess characters get +1 Strength and +1 Willpower", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: beastGraciousPrinceEnchanted },
        { card: arielOnHumanLegs }, // Princess
        { card: aladdinStreetRat }, // Not a Princess
      ],
    });

    const princessId = testEngine.findCardInstanceId(arielOnHumanLegs, "play");
    const nonPrincessId = testEngine.findCardInstanceId(aladdinStreetRat, "play");
    const beastId = testEngine.findCardInstanceId(beastGraciousPrinceEnchanted, "play");

    // Princess should get +1 Strength and +1 Willpower
    expect(testEngine.asServer().getCard(princessId).strength).toBe(arielOnHumanLegs.strength + 1);
    expect(testEngine.asServer().getCard(princessId).willpower).toBe(
      arielOnHumanLegs.willpower + 1,
    );

    // Non-Princess should NOT get any buff
    expect(testEngine.asServer().getCard(nonPrincessId).strength).toBe(aladdinStreetRat.strength);
    expect(testEngine.asServer().getCard(nonPrincessId).willpower).toBe(aladdinStreetRat.willpower);

    // Beast itself is a Prince, not a Princess - should NOT get buffed
    expect(testEngine.asServer().getCard(beastId).strength).toBe(
      beastGraciousPrinceEnchanted.strength,
    );
    expect(testEngine.asServer().getCard(beastId).willpower).toBe(
      beastGraciousPrinceEnchanted.willpower,
    );
  });
});
