import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { thePlank } from "./133-the-plank";

const doomedHero = createMockCharacter({
  id: "the-plank-hero",
  name: "Doomed Hero",
  cost: 3,
  classifications: ["Storyborn", "Hero"],
});

const schemingVillain = createMockCharacter({
  id: "the-plank-villain",
  name: "Scheming Villain",
  cost: 3,
  classifications: ["Storyborn", "Villain"],
});

describe("The Plank", () => {
  it("banishes the chosen Hero character with the first mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        play: [thePlank],
      },
      {
        play: [doomedHero],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(thePlank, {
        choiceIndex: 0,
        targets: [doomedHero],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(doomedHero)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(thePlank)).toBe("discard");
  });

  it("readies the chosen Villain and stops them from questing for the rest of the turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [{ card: thePlank }, { card: schemingVillain, exerted: true, isDrying: false }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(thePlank, {
        choiceIndex: 1,
        targets: [schemingVillain],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(schemingVillain)).toBe(false);
    expect(testEngine.asPlayerOne().quest(schemingVillain).success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(thePlank)).toBe("discard");
  });
});
