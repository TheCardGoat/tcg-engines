import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { pocahontasSteadfastTraveler } from "./171-pocahontas-steadfast-traveler";

const anotherCharacter = createMockCharacter({
  id: "pocahontas-ally",
  name: "Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
});

const locationCard = createMockLocation({
  id: "pocahontas-location",
  name: "Test Location",
  cost: 2,
  willpower: 5,
  moveCost: 1,
});

describe("Pocahontas - Steadfast Traveler", () => {
  it("WANDERING SPIRIT - returns location from discard to hand when questing after playing another character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [anotherCharacter],
        play: [pocahontasSteadfastTraveler],
        discard: [locationCard],
        inkwell: 1,
        deck: 5,
      },
      {
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().playCard(anotherCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().quest(pocahontasSteadfastTraveler)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(pocahontasSteadfastTraveler, {
        resolveOptional: true,
        targets: [locationCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(locationCard)).toBe("hand");
  });
});
