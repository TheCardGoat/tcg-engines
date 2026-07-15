import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { liloPatientWeaver } from "./010-lilo-patient-weaver";

const supportTarget = createMockCharacter({
  id: "lilo-patient-weaver-support-target",
  name: "Support Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Lilo - Patient Weaver", () => {
  it("has Support and can add her strength to a chosen character when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [liloPatientWeaver, supportTarget],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().hasKeyword(liloPatientWeaver, "Support")).toBe(true);
    expect(testEngine.asPlayerOne().quest(liloPatientWeaver)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(liloPatientWeaver, {
        resolveOptional: true,
        targets: [supportTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(supportTarget)).toBe(
      supportTarget.strength + liloPatientWeaver.strength,
    );
  });
});
