import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { kevinFlightlessBird } from "../characters/088-kevin-flightless-bird";
import { myAdventureBook } from "./106-my-adventure-book";

const newMemory = createMockAction({
  id: "my-adventure-book-new-memory",
  name: "New Memory",
  cost: 1,
});

const notKevin = createMockCharacter({
  id: "my-adventure-book-not-kevin",
  name: "Russell",
  cost: 2,
});

const bottomCard = createMockAction({
  id: "my-adventure-book-bottom-card",
  name: "Bottom Card",
  cost: 1,
});

describe("My Adventure Book", () => {
  it("reveals a non-character card from the top of your deck and puts it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [newMemory],
      inkwell: 1,
      play: [myAdventureBook],
    });

    expect(testEngine.asPlayerOne().activateAbility(myAdventureBook)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(newMemory)).toBe("hand");
  });

  it("reveals a character named Kevin from the top of your deck and puts it into your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [kevinFlightlessBird],
      inkwell: 1,
      play: [myAdventureBook],
    });

    expect(testEngine.asPlayerOne().activateAbility(myAdventureBook)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(kevinFlightlessBird)).toBe("hand");
  });

  it("reveals a character not named Kevin from the top of your deck and puts it on the bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [bottomCard, notKevin],
      inkwell: 1,
      play: [myAdventureBook],
    });

    expect(testEngine.asPlayerOne().activateAbility(myAdventureBook)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(notKevin)).toBe("deck");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      notKevin.id,
      bottomCard.id,
    ]);
  });
});
