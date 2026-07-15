import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { thaddeusEKlangMetallicLeader } from "./194-thaddeus-e-klang-metallic-leader";

const testLocation = createMockLocation({
  id: "thaddeus-test-location",
  name: "Thaddeus Test Location",
  cost: 2,
});

const targetCharacter = createMockCharacter({
  id: "thaddeus-target-character",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 4,
});

describe("Thaddeus E. Klang - Metallic Leader", () => {
  describe("MY TEETH ARE SHARPER - Whenever this character quests while at a location, you may deal 1 damage to chosen character.", () => {
    it("triggers and deals 1 damage to chosen character when questing at a location", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [thaddeusEKlangMetallicLeader, testLocation],
          inkwell: testLocation.moveCost,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(thaddeusEKlangMetallicLeader, testLocation)
          .success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().quest(thaddeusEKlangMetallicLeader).success).toBe(true);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(thaddeusEKlangMetallicLeader, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardByInstance(targetCharacter).damage).toBe(1);
    });

    it("does not deal damage when questing without being at a location (per CRD 6.2.7: condition checked at resolution)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [thaddeusEKlangMetallicLeader, testLocation],
          inkwell: testLocation.moveCost,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().quest(thaddeusEKlangMetallicLeader).success).toBe(true);

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      expect(testEngine.asPlayerTwo().getCardByInstance(targetCharacter).damage).toBe(0);
    });

    it("does nothing when the optional ability is declined", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [thaddeusEKlangMetallicLeader, testLocation],
          inkwell: testLocation.moveCost,
        },
        {
          play: [targetCharacter],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().moveCharacterToLocation(thaddeusEKlangMetallicLeader, testLocation)
          .success,
      ).toBe(true);

      expect(testEngine.asPlayerOne().quest(thaddeusEKlangMetallicLeader).success).toBe(true);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(thaddeusEKlangMetallicLeader, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getCardByInstance(targetCharacter).damage).toBe(0);
    });
  });
});
