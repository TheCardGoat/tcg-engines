import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rlsLegacySolarGalleon } from "./136-rls-legacy-solar-galleon";

const firstCrewmate = createMockCharacter({
  id: "rls-first-crewmate",
  name: "First Crewmate",
  cost: 2,
});

const secondCrewmate = createMockCharacter({
  id: "rls-second-crewmate",
  name: "Second Crewmate",
  cost: 2,
});

describe("RLS Legacy - Solar Galleon", () => {
  it("gives characters here Evasive", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [rlsLegacySolarGalleon, firstCrewmate],
      inkwell: rlsLegacySolarGalleon.moveCost,
    });

    expect(testEngine.asPlayerOne().getCard(firstCrewmate)?.hasEvasive).toBe(false);

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(firstCrewmate, rlsLegacySolarGalleon)
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(firstCrewmate)?.hasEvasive).toBe(true);
  });

  it("regression: characters at the location have Evasive, characters not at location do not", () => {
    const thirdCrewmate = createMockCharacter({
      id: "rls-third-crewmate",
      name: "Third Crewmate",
      cost: 2,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        rlsLegacySolarGalleon,
        { card: firstCrewmate, atLocation: rlsLegacySolarGalleon },
        thirdCrewmate,
      ],
      inkwell: rlsLegacySolarGalleon.moveCost,
    });

    // Character at location should have Evasive
    expect(testEngine.asPlayerOne().getCard(firstCrewmate)?.hasEvasive).toBe(true);

    // Character NOT at the location should NOT have Evasive
    expect(testEngine.asPlayerOne().getCard(thirdCrewmate)?.hasEvasive).toBe(false);
  });

  it("reduces the move cost by 2 when you already have a character here", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        rlsLegacySolarGalleon,
        { card: firstCrewmate, atLocation: rlsLegacySolarGalleon },
        secondCrewmate,
      ],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(secondCrewmate, rlsLegacySolarGalleon)
        .success,
    ).toBe(true);
  });
});
