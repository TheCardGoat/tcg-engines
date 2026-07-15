import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { goofySetForAdventureEpic } from "./211-goofy-set-for-adventure-epic";

const vacationStop = createMockLocation({
  id: "goofy-vacation-stop",
  name: "Vacation Stop",
  cost: 2,
  moveCost: 1,
});

const secondStop = createMockLocation({
  id: "goofy-second-stop",
  name: "Second Stop",
  cost: 2,
  moveCost: 1,
});

const travelBuddy = createMockCharacter({
  id: "goofy-travel-buddy",
  name: "Travel Buddy",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const drawCard = createMockCharacter({
  id: "goofy-draw-card",
  name: "Draw Card",
  cost: 1,
});

describe("Goofy - Set for Adventure (Epic)", () => {
  it("moves another character to Goofy's location for free and draws a card once during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofySetForAdventureEpic, vacationStop, secondStop, travelBuddy],
      inkwell: 2,
      deck: [drawCard],
    });

    const playerOne = testEngine.asPlayerOne();

    expect(
      playerOne.moveCharacterToLocation(goofySetForAdventureEpic, vacationStop),
    ).toBeSuccessfulCommand();
    expect(playerOne.getBagCount()).toBe(1);

    expect(
      playerOne.resolvePendingByCard(goofySetForAdventureEpic, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(playerOne.resolveNextPending({ targets: [travelBuddy] })).toBeSuccessfulCommand();

    expect(playerOne).toBeAtLocation({
      card: travelBuddy,
      location: vacationStop,
    });
    expect(playerOne.getZonesCardCount()).toMatchObject({
      hand: 1,
      deck: 0,
    });

    expect(
      playerOne.moveCharacterToLocation(goofySetForAdventureEpic, secondStop),
    ).toBeSuccessfulCommand();
    expect(playerOne.getBagCount()).toBe(0);
  });
});
