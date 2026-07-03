import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { bestiesAssemble } from "./034-besties-assemble";

const bestiesCharacter = createMockCharacter({
  id: "besties-assemble-character",
  name: "Besties Character",
  cost: 2,
});

const bestiesItem = createMockItem({
  id: "besties-assemble-item",
  name: "Besties Item",
  cost: 2,
});

const bestiesActionA = createMockAction({
  id: "besties-assemble-action-a",
  name: "Besties Action A",
  cost: 1,
});

const bestiesActionB = createMockAction({
  id: "besties-assemble-action-b",
  name: "Besties Action B",
  cost: 1,
});

describe("Besties, Assemble!", () => {
  it("reveals a character from the top 4 cards and puts the rest on bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [bestiesAssemble],
      inkwell: bestiesAssemble.cost,
      deck: [bestiesActionA, bestiesCharacter, bestiesItem, bestiesActionB],
    });

    expect(testEngine.asPlayerOne().playCard(bestiesAssemble)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [bestiesCharacter] },
          { zone: "deck-bottom", cards: [bestiesActionB, bestiesItem, bestiesActionA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bestiesCharacter)).toBe("hand");
  });
});
