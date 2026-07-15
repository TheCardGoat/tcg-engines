import { describe, expect, it } from "bun:test";
import {
  LorcanaTestEngine,
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { jimHawkinsRiggingSpecialist } from "./183-jim-hawkins-rigging-specialist";

const targetCharacter = createMockCharacter({
  id: "jim-rs-target-char",
  name: "Target Character",
  cost: 2,
  willpower: 5,
});

const targetLocation = createMockLocation({
  id: "jim-rs-target-loc",
  name: "Target Location",
  cost: 3,
  moveCost: 1,
  willpower: 6,
  lore: 1,
});

describe("Jim Hawkins - Rigging Specialist", () => {
  it("should have Shift keyword with cost 3", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jimHawkinsRiggingSpecialist],
    });

    const cardUnderTest = testEngine.getCardModel(jimHawkinsRiggingSpecialist);
    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.shiftInkCost).toBe(3);
  });

  describe("BATTLE STATION - When you play this character, you may deal 1 damage to chosen character or location.", () => {
    it("creates an optional bag effect when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jimHawkinsRiggingSpecialist],
          inkwell: jimHawkinsRiggingSpecialist.cost,
        },
        {
          play: [targetCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jimHawkinsRiggingSpecialist),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("deals 1 damage to chosen character when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jimHawkinsRiggingSpecialist],
          inkwell: jimHawkinsRiggingSpecialist.cost,
        },
        {
          play: [targetCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jimHawkinsRiggingSpecialist),
      ).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jimHawkinsRiggingSpecialist, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetCharacter] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(1);
    });

    it("deals 1 damage to chosen location when you accept the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jimHawkinsRiggingSpecialist],
          inkwell: jimHawkinsRiggingSpecialist.cost,
        },
        {
          play: [targetLocation],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jimHawkinsRiggingSpecialist),
      ).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jimHawkinsRiggingSpecialist, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [targetLocation] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetLocation)).toBe(1);
    });

    it("deals no damage when you decline the optional trigger", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [jimHawkinsRiggingSpecialist],
          inkwell: jimHawkinsRiggingSpecialist.cost,
        },
        {
          play: [targetCharacter],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(jimHawkinsRiggingSpecialist),
      ).toBeSuccessfulCommand();
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(jimHawkinsRiggingSpecialist, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(0);
    });
  });
});
