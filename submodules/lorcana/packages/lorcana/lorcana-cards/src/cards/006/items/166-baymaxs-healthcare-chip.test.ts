import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { baymaxsHealthcareChip } from "./166-baymaxs-healthcare-chip";

const patient = createMockCharacter({
  id: "baymax-chip-patient",
  name: "Patient",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const robotHelper = createMockCharacter({
  id: "baymax-chip-robot-helper",
  name: "Robot Helper",
  cost: 2,
  classifications: ["Storyborn", "Robot"],
  strength: 2,
  willpower: 3,
});

describe("Baymax's Healthcare Chip", () => {
  it("removes up to 1 damage from the chosen character by default", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [baymaxsHealthcareChip, { card: patient, damage: 2 }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(baymaxsHealthcareChip, {
        targets: [patient],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(patient)?.damage).toBe(1);
  });

  it("can remove up to 3 damage when you have a Robot character in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: 2,
      play: [baymaxsHealthcareChip, robotHelper, { card: patient, damage: 4 }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(baymaxsHealthcareChip, {
        choiceIndex: 1,
        targets: [patient],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCard(patient)?.damage).toBe(1);
  });
});
