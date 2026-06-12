import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { sevenDwarfsMineSecureFortress } from "./204-seven-dwarfs-mine-secure-fortress";

const sleepyKnight = createMockCharacter({
  id: "mine-knight",
  name: "Sleepy Knight",
  cost: 2,
  classifications: ["Storyborn", "Knight"],
});

const nonKnightCharacter = createMockCharacter({
  id: "mine-non-knight",
  name: "Mine Worker",
  cost: 2,
  classifications: ["Storyborn"],
});

const secondKnight = createMockCharacter({
  id: "mine-second-knight",
  name: "Second Knight",
  cost: 2,
  classifications: ["Storyborn", "Knight"],
});

const targetDummy = createMockCharacter({
  id: "mine-target",
  name: "Mine Target",
  cost: 2,
  willpower: 4,
});

const otherLocation = createMockLocation({
  id: "other-location",
  name: "Other Location",
  cost: 1,
  moveCost: 1,
});

describe("Seven Dwarfs' Mine - Secure Fortress", () => {
  it("deals 2 damage the first time a Knight moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [sevenDwarfsMineSecureFortress, sleepyKnight],
        inkwell: sevenDwarfsMineSecureFortress.moveCost,
        deck: 1,
      },
      {
        play: [targetDummy],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(sleepyKnight, sevenDwarfsMineSecureFortress)
        .success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sevenDwarfsMineSecureFortress).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [targetDummy] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerTwo().getCard(targetDummy)?.damage).toBe(2);
  });

  it("deals 1 damage the first time a Non-Knight moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [sevenDwarfsMineSecureFortress, nonKnightCharacter],
        inkwell: sevenDwarfsMineSecureFortress.moveCost,
        deck: 1,
      },
      {
        play: [targetDummy],
        deck: 1,
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(nonKnightCharacter, sevenDwarfsMineSecureFortress).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sevenDwarfsMineSecureFortress).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [targetDummy] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerTwo().getCard(targetDummy)?.damage).toBe(1);
  });

  it("does not trigger a second time in the same turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [sevenDwarfsMineSecureFortress, sleepyKnight, secondKnight, targetDummy],
        inkwell: sevenDwarfsMineSecureFortress.moveCost * 2,
        deck: 1,
      },
      {
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(sleepyKnight, sevenDwarfsMineSecureFortress)
        .success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sevenDwarfsMineSecureFortress).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().resolveNextPending({ targets: [targetDummy] }).success).toBe(
      true,
    );

    expect(testEngine.asPlayerOne().getCard(targetDummy)?.damage).toBe(2);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(secondKnight, sevenDwarfsMineSecureFortress)
        .success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getCard(targetDummy)?.damage).toBe(2);
  });

  it("can decline the optional damage effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [sevenDwarfsMineSecureFortress, sleepyKnight],
        inkwell: sevenDwarfsMineSecureFortress.moveCost,
        deck: 1,
      },
      {
        play: [targetDummy],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(sleepyKnight, sevenDwarfsMineSecureFortress)
        .success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(sevenDwarfsMineSecureFortress, {
        resolveOptional: false,
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCard(targetDummy)?.damage).toBe(0);
  });

  it("does not trigger when moving a character to a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sevenDwarfsMineSecureFortress, otherLocation, nonKnightCharacter],
      inkwell: otherLocation.moveCost,
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(nonKnightCharacter, otherLocation).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);
  });
});
