import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { moanaBornLeader } from "./116-moana-born-leader";

const testLocation = createMockLocation({
  id: "moana-test-location",
  name: "Moana Test Location",
  cost: 2,
});

const allyAtLocation = createMockCharacter({
  id: "moana-ally-at-location",
  name: "Ally At Location",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const secondAllyAtLocation = createMockCharacter({
  id: "moana-second-ally",
  name: "Second Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const characterNotAtLocation = createMockCharacter({
  id: "moana-not-at-location",
  name: "Not At Location",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Moana - Born Leader", () => {
  it("has Shift 3", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [moanaBornLeader],
    });

    expect(testEngine.asPlayerOne().getCardByInstance(moanaBornLeader).keywords).toEqual(
      expect.arrayContaining(["Shift"]),
    );
  });

  describe("WELCOME TO MY BOAT - Whenever this character quests while at a location, ready all other characters here. They can't quest for the rest of this turn.", () => {
    it("readies other characters at the same location when questing", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: moanaBornLeader, atLocation: testLocation },
          testLocation,
          { card: allyAtLocation, atLocation: testLocation, exerted: true },
          {
            card: secondAllyAtLocation,
            atLocation: testLocation,
            exerted: true,
          },
          { card: characterNotAtLocation, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().isExerted(allyAtLocation)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(secondAllyAtLocation)).toBe(true);
      expect(testEngine.asPlayerOne().isExerted(characterNotAtLocation)).toBe(true);

      expect(testEngine.asPlayerOne().quest(moanaBornLeader)).toBeSuccessfulCommand();

      // Characters at the same location should be readied
      expect(testEngine.asPlayerOne().isExerted(allyAtLocation)).toBe(false);
      expect(testEngine.asPlayerOne().isExerted(secondAllyAtLocation)).toBe(false);

      // Character NOT at the location should remain exerted
      expect(testEngine.asPlayerOne().isExerted(characterNotAtLocation)).toBe(true);

      // Moana herself should be exerted (from questing)
      expect(testEngine.asPlayerOne().isExerted(moanaBornLeader)).toBe(true);
    });

    it("applies cant-quest restriction to readied characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: moanaBornLeader, atLocation: testLocation },
          testLocation,
          { card: allyAtLocation, atLocation: testLocation, exerted: true },
          { card: characterNotAtLocation, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaBornLeader)).toBeSuccessfulCommand();

      // Readied characters at the location should have cant-quest restriction
      expect(testEngine.hasRestriction(allyAtLocation, "cant-quest")).toBe(true);

      // Character not at the location should NOT have the restriction
      expect(testEngine.hasRestriction(characterNotAtLocation, "cant-quest")).toBe(false);
    });

    it("does not trigger when not at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          moanaBornLeader,
          testLocation,
          { card: allyAtLocation, atLocation: testLocation, exerted: true },
        ],
      });

      expect(testEngine.asPlayerOne().quest(moanaBornLeader)).toBeSuccessfulCommand();

      // Ally should remain exerted since Moana is not at a location
      expect(testEngine.asPlayerOne().isExerted(allyAtLocation)).toBe(true);
    });

    it("does not ready Moana herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: moanaBornLeader, atLocation: testLocation }, testLocation],
      });

      expect(testEngine.asPlayerOne().quest(moanaBornLeader)).toBeSuccessfulCommand();

      // Moana should remain exerted from questing
      expect(testEngine.asPlayerOne().isExerted(moanaBornLeader)).toBe(true);
    });
  });
});
