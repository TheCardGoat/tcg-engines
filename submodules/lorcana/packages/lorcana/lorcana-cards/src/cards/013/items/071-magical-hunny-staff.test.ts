import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicalHunnyStaff } from "./071-magical-hunny-staff";

const hunnyGiftTarget = createMockCharacter({
  id: "magical-hunny-staff-gift-target",
  name: "Gift Target",
  cost: 2,
});

const hunnyRogue = createMockCharacter({
  id: "magical-hunny-staff-hunny-rogue",
  name: "Hunny Rogue",
  cost: 2,
  classifications: ["Storyborn", "Hunny"],
});

describe("Magical Hunny Staff", () => {
  it("gives a chosen character of yours the Hunny classification until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [magicalHunnyStaff, hunnyGiftTarget],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(magicalHunnyStaff, {
        ability: "GIFT OF THE HIVE",
        targets: [hunnyGiftTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(hunnyGiftTarget).classifications?.includes("Hunny")).toBe(true);
  });

  it("gives a chosen Hunny character of yours Evasive until your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [magicalHunnyStaff, hunnyRogue],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(magicalHunnyStaff, {
        ability: "SPELL OF SWIFTNESS",
        targets: [hunnyRogue],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(hunnyRogue, "Evasive")).toBe(true);
  });

  it("lets a second Magical Hunny Staff give Evasive to a character that was just given the Hunny classification", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 3,
      play: [magicalHunnyStaff, magicalHunnyStaff, hunnyGiftTarget],
    });
    const [giftStaffId, swiftnessStaffId] = testEngine
      .getCardInstanceIdsInZone("play", "player_one")
      .filter(
        (cardId) => testEngine.getCardByInstance(cardId).definitionId === magicalHunnyStaff.id,
      );

    expect(
      testEngine.asPlayerOne().activateAbility(giftStaffId, {
        ability: "GIFT OF THE HIVE",
        targets: [hunnyGiftTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getCard(hunnyGiftTarget).classifications?.includes("Hunny")).toBe(true);

    expect(
      testEngine.asPlayerOne().activateAbility(swiftnessStaffId, {
        ability: "SPELL OF SWIFTNESS",
        targets: [hunnyGiftTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(hunnyGiftTarget, "Evasive")).toBe(true);
  });
});
