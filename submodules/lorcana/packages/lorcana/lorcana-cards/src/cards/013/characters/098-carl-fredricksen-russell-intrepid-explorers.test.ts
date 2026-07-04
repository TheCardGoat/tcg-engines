import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { carlFredricksenRussellIntrepidExplorers } from "./098-carl-fredricksen-russell-intrepid-explorers";

const shiftBase = createMockCharacter({
  id: "carl-russell-shift-base",
  name: "Carl Fredricksen & Russell",
  cost: 2,
});

const location = createMockLocation({
  id: "carl-russell-location",
  name: "Carl Russell Location",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "carl-russell-other-location",
  name: "Carl Russell Other Location",
  cost: 2,
});

const characterAtLocation = createMockCharacter({
  id: "carl-russell-character-at-location",
  name: "Character At Location",
  cost: 2,
  lore: 1,
});

const characterAtOtherLocation = createMockCharacter({
  id: "carl-russell-character-at-other-location",
  name: "Character At Other Location",
  cost: 2,
  lore: 1,
});

describe("Carl Fredricksen & Russell - Intrepid Explorers", () => {
  it("can be shifted onto a character with the same name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [shiftBase],
      hand: [carlFredricksenRussellIntrepidExplorers],
      inkwell: 4,
      deck: [],
    });
    const shiftTarget = testEngine.findCardInstanceId(shiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(carlFredricksenRussellIntrepidExplorers, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(carlFredricksenRussellIntrepidExplorers)).toBe(
      "play",
    );
  });

  it("gives all characters at its location +1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: carlFredricksenRussellIntrepidExplorers, atLocation: location },
        { card: characterAtLocation, atLocation: location },
        { card: characterAtOtherLocation, atLocation: otherLocation },
        location,
        otherLocation,
      ],
      deck: [],
    });

    expect(testEngine.asPlayerOne().getCardLore(carlFredricksenRussellIntrepidExplorers)).toBe(3);
    expect(testEngine.asPlayerOne().getCardLore(characterAtLocation)).toBe(2);
    expect(testEngine.asPlayerOne().getCardLore(characterAtOtherLocation)).toBe(1);
  });

  it("gives characters at its location Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: carlFredricksenRussellIntrepidExplorers, atLocation: location },
        { card: characterAtLocation, atLocation: location },
        location,
      ],
      deck: [],
    });

    expect(
      testEngine.asPlayerOne().hasKeyword(carlFredricksenRussellIntrepidExplorers, "Evasive"),
    ).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(characterAtLocation, "Evasive")).toBe(true);
  });
});
