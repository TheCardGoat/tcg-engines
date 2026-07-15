import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { russellSeniorWildernessExplorer } from "./079-russell-senior-wilderness-explorer";

const russellShiftBase = createMockCharacter({
  id: "russell-senior-shift-base",
  name: "Russell",
  cost: 2,
});

const campsite = createMockLocation({
  id: "russell-senior-campsite",
  name: "Campsite",
  cost: 2,
  moveCost: 1,
  lore: 1,
});

const characterAtLocation = createMockCharacter({
  id: "russell-senior-character-at-location",
  name: "Character at Location",
  cost: 2,
  strength: 2,
});

const strongQuester = createMockCharacter({
  id: "russell-senior-strong-quester",
  name: "Strong Quester",
  cost: 4,
  strength: 4,
  lore: 1,
});

describe("Russell - Senior Wilderness Explorer", () => {
  it("can be played using Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [russellSeniorWildernessExplorer],
      play: [russellShiftBase],
      inkwell: 3,
    });
    const shiftTarget = testEngine.findCardInstanceId(russellShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(russellSeniorWildernessExplorer, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(russellSeniorWildernessExplorer)).toBe("play");
  });

  it("gives your characters at locations +1 strength", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        russellSeniorWildernessExplorer,
        campsite,
        { card: characterAtLocation, atLocation: campsite },
      ],
    });

    expect(testEngine.asPlayerOne().getCardStrength(characterAtLocation)).toBe(3);
  });

  it("gains 1 lore when one of your characters with 4 strength or more quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [russellSeniorWildernessExplorer, { card: strongQuester, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(strongQuester)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(russellSeniorWildernessExplorer),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
