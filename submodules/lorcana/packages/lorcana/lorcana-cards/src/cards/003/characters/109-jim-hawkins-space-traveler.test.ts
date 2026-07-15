import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockLocation } from "@tcg/lorcana-engine/testing";
import { jimHawkinsSpaceTraveler } from "./109-jim-hawkins-space-traveler";

const cheapLocation = createMockLocation({
  id: "jim-hawkins-space-traveler-cheap-location",
  name: "Cheap Location",
  cost: 4,
  moveCost: 1,
  lore: 1,
  willpower: 6,
});

const expensiveLocation = createMockLocation({
  id: "jim-hawkins-space-traveler-expensive-location",
  name: "Expensive Location",
  cost: 5,
  moveCost: 1,
  lore: 1,
  willpower: 6,
});

const anotherLocation = createMockLocation({
  id: "jim-hawkins-space-traveler-another-location",
  name: "Another Location",
  cost: 3,
  moveCost: 1,
  lore: 1,
  willpower: 6,
});

describe("Jim Hawkins - Space Traveler", () => {
  describe("THIS IS IT! - When you play this character, you may play a location with cost 4 or less for free.", () => {
    it("plays a location with cost 4 or less for free when the ability is accepted", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jimHawkinsSpaceTraveler.cost,
        hand: [jimHawkinsSpaceTraveler, cheapLocation],
        deck: 5,
      });

      const locationId = testEngine.findCardInstanceId(cheapLocation, "hand");
      expect(testEngine.asPlayerOne().playCard(jimHawkinsSpaceTraveler)).toBeSuccessfulCommand();

      // The optional bag effect: choose to accept and play the location
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
          targets: [locationId],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("play");
    });

    it("does not play the location when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jimHawkinsSpaceTraveler.cost,
        hand: [jimHawkinsSpaceTraveler, cheapLocation],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(jimHawkinsSpaceTraveler)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(cheapLocation)).toBe("hand");
    });

    it("cannot play a location with cost 5 or more for free (no eligible target)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jimHawkinsSpaceTraveler.cost,
        hand: [jimHawkinsSpaceTraveler, expensiveLocation],
        deck: 5,
      });

      const locationId = testEngine.findCardInstanceId(expensiveLocation, "hand");
      expect(testEngine.asPlayerOne().playCard(jimHawkinsSpaceTraveler)).toBeSuccessfulCommand();

      // The bag effect is present but resolving it with the expensive location does nothing
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
          targets: [locationId],
        }),
      ).toBeSuccessfulCommand();

      // The expensive location stays in hand because it was filtered out
      expect(testEngine.asPlayerOne().getCardZone(expensiveLocation)).toBe("hand");
    });
  });

  describe("TAKE THE HELM - Whenever you play a location, this character may move there for free.", () => {
    it("may move to a location for free when a location is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: cheapLocation.cost,
        hand: [cheapLocation],
        play: [jimHawkinsSpaceTraveler],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(cheapLocation)).toBeSuccessfulCommand();

      // The optional bag effect: TAKE THE HELM triggers
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: jimHawkinsSpaceTraveler,
        location: cheapLocation,
      });
    });

    it("does not move when the optional TAKE THE HELM ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: cheapLocation.cost,
        hand: [cheapLocation],
        play: [jimHawkinsSpaceTraveler],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(cheapLocation)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      const jimCard = testEngine.asPlayerOne().getCard(jimHawkinsSpaceTraveler);
      expect(jimCard?.atLocationId).toBeFalsy();
    });

    it("triggers TAKE THE HELM when THIS IS IT! plays a location for free", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: jimHawkinsSpaceTraveler.cost,
        hand: [jimHawkinsSpaceTraveler, anotherLocation],
        deck: 5,
      });

      const locationId = testEngine.findCardInstanceId(anotherLocation, "hand");

      expect(testEngine.asPlayerOne().playCard(jimHawkinsSpaceTraveler)).toBeSuccessfulCommand();

      // THIS IS IT! triggers first - accept and play the location
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [thisIsItBagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
          targets: [locationId],
        }),
      ).toBeSuccessfulCommand();

      // The location is now in play
      expect(testEngine.asPlayerOne().getCardZone(anotherLocation)).toBe("play");

      // TAKE THE HELM then triggers - accept and move Jim to the location
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [takeTheHelmBagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: jimHawkinsSpaceTraveler,
        location: anotherLocation,
      });
    });

    it("may move to a different location than the one already at", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: anotherLocation.cost,
        hand: [anotherLocation],
        play: [{ card: jimHawkinsSpaceTraveler, atLocation: cheapLocation }, cheapLocation],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(anotherLocation)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(jimHawkinsSpaceTraveler, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toBeAtLocation({
        card: jimHawkinsSpaceTraveler,
        location: anotherLocation,
      });
    });
  });
});
