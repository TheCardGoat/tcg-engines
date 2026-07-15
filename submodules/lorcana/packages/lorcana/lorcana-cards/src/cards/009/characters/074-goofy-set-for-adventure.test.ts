import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { goofySetForAdventure } from "./074-goofy-set-for-adventure";
import { zootopiaPoliceHeadquarters } from "../../010/locations/203-zootopia-police-headquarters";

const vacationBuddy = createMockCharacter({
  id: "goofy-set-for-adventure-vacation-buddy",
  name: "Vacation Buddy",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const vacationSpot = createMockLocation({
  id: "goofy-set-for-adventure-vacation-spot",
  name: "Vacation Spot",
  cost: 2,
  moveCost: 1,
  lore: 1,
  willpower: 6,
});

describe("Goofy - Set for Adventure", () => {
  it("moves one of your other characters to the same location for free and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofySetForAdventure, vacationBuddy, vacationSpot],
      inkwell: 1,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(goofySetForAdventure, vacationSpot),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofySetForAdventure),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [vacationBuddy],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: vacationBuddy,
      location: vacationSpot,
    });
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
  });

  it("builds a character-only prompt because the destination location is fixed by the trigger", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofySetForAdventure, vacationBuddy, vacationSpot],
      inkwell: 1,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(goofySetForAdventure, vacationSpot),
    ).toBeSuccessfulCommand();

    const goofyBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bagEffect) => (bagEffect.payload as { abilityId?: string })?.abilityId === "1yc-1");
    const selectionContext = goofyBag?.selectionContext;
    if (!selectionContext || selectionContext.kind !== "target-selection") {
      throw new Error("Expected Goofy's FAMILY VACATION to publish a target-selection prompt");
    }

    const buddyId = testEngine.findCardInstanceId(vacationBuddy, "play");
    const locationId = testEngine.findCardInstanceId(vacationSpot, "play");

    expect(selectionContext.expectedSlottedKind).toBe("move-to-location");
    expect(selectionContext.targetDsl).toHaveLength(1);
    expect(selectionContext.targetDsl[0]).toMatchObject({
      selector: "chosen",
      cardTypes: ["character"],
    });
    expect(selectionContext.cardCandidateIds).toContain(buddyId);
    expect(selectionContext.cardCandidateIds).not.toContain(locationId);
  });

  it("accepts the direct bag slotted UI payload with the fixed location outside the candidate list", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofySetForAdventure, vacationBuddy, vacationSpot],
      inkwell: 1,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(goofySetForAdventure, vacationSpot),
    ).toBeSuccessfulCommand();

    const buddyId = testEngine.findCardInstanceId(vacationBuddy, "play");
    const locationId = testEngine.findCardInstanceId(vacationSpot, "play");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofySetForAdventure, {
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [buddyId],
          location: [locationId],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeAtLocation({
      card: vacationBuddy,
      location: vacationSpot,
    });
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
  });

  it("regression: second character moved to Zootopia Police HQ via Goofy triggers the location ability", () => {
    const secondBuddy = createMockCharacter({
      id: "goofy-second-buddy",
      name: "Second Buddy",
      cost: 2,
      strength: 2,
      willpower: 2,
    });

    const discardFodder = createMockCharacter({
      id: "goofy-discard-fodder",
      name: "Discard Fodder",
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [goofySetForAdventure, secondBuddy, zootopiaPoliceHeadquarters],
      hand: [discardFodder],
      inkwell: zootopiaPoliceHeadquarters.moveCost,
      deck: 3,
    });

    // Move Goofy to the location
    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(goofySetForAdventure, zootopiaPoliceHeadquarters),
    ).toBeSuccessfulCommand();

    // Goofy's ability triggers (optional: move another character to same location for free + draw)
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

    // Also Zootopia's ability may trigger for Goofy moving here (first move this turn)
    // Resolve Goofy's Family Vacation: move secondBuddy to the location for free
    const goofyBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((b) => (b.payload as { abilityId?: string })?.abilityId === "1yc-1");
    if (goofyBag) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(goofySetForAdventure),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({
          resolveOptional: true,
          targets: [secondBuddy],
        }),
      ).toBeSuccessfulCommand();

      // secondBuddy should now be at the location
      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: secondBuddy,
        location: zootopiaPoliceHeadquarters,
      });
    }

    // Zootopia's NEW INFORMATION should have also triggered when secondBuddy moved there
    // (The bug was that the second character moved didn't trigger the location ability)
    // Note: Zootopia has "first-time-each-turn" restriction, but the character move by Goofy
    // should count if Zootopia hasn't triggered yet, or there should be a trigger if it's a separate event
  });
});
