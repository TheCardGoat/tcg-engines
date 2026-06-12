import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { theIslandsIPulledFromTheSea } from "./130-the-islands-i-pulled-from-the-sea";

const locationA = createMockLocation({
  id: "tiipfts-location-a",
  name: "Location A",
  cost: 2,
  moveCost: 1,
  willpower: 4,
  lore: 1,
});

const locationB = createMockLocation({
  id: "tiipfts-location-b",
  name: "Location B",
  cost: 3,
  moveCost: 2,
  willpower: 5,
  lore: 2,
});

const nonLocationCard = createMockCharacter({
  id: "tiipfts-character",
  name: "Non Location",
  cost: 2,
});

describe("The Islands I Pulled from the Sea", () => {
  it("auto-selects when only one location exists in deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theIslandsIPulledFromTheSea],
      inkwell: theIslandsIPulledFromTheSea.cost,
      deck: [nonLocationCard, locationA, nonLocationCard],
    });

    // With only one matching candidate, search-deck auto-resolves
    expect(testEngine.asPlayerOne().playCard(theIslandsIPulledFromTheSea)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locationA)).toBe("hand");
  });

  it("prompts for selection when multiple locations exist in deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theIslandsIPulledFromTheSea],
      inkwell: theIslandsIPulledFromTheSea.cost,
      deck: [nonLocationCard, locationA, locationB, nonLocationCard],
    });

    // Play the card — with multiple candidates, the engine should suspend
    expect(testEngine.asPlayerOne().playCard(theIslandsIPulledFromTheSea)).toBeSuccessfulCommand();

    // Resolve the pending selection by choosing location B
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theIslandsIPulledFromTheSea, {
        targets: [locationB],
      }),
    ).toBeSuccessfulCommand();

    // The chosen location (B) should be in hand
    expect(testEngine.asPlayerOne().getCardZone(locationB)).toBe("hand");
    // Location A should remain in deck
    expect(testEngine.asPlayerOne().getCardZone(locationA)).toBe("deck");
  });

  it("does nothing when no locations exist in deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [theIslandsIPulledFromTheSea],
      inkwell: theIslandsIPulledFromTheSea.cost,
      deck: [nonLocationCard, nonLocationCard, nonLocationCard],
    });

    expect(testEngine.asPlayerOne().playCard(theIslandsIPulledFromTheSea)).toBeSuccessfulCommand();
  });
});
