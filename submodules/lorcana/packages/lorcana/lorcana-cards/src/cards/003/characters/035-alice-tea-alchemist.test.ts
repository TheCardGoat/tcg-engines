import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aliceTeaAlchemist } from "./035-alice-tea-alchemist";

const chosenMerlin = createMockCharacter({
  id: "alice-chosen-merlin",
  name: "Merlin",
  cost: 2,
});

const otherMerlin = createMockCharacter({
  id: "alice-other-merlin",
  name: "Merlin",
  cost: 3,
});

const madamMim = createMockCharacter({
  id: "alice-madam-mim",
  name: "Madam Mim",
  cost: 2,
});

describe("Alice - Tea Alchemist", () => {
  it("exerts the chosen opposing character and all other opposing characters with the same name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: aliceTeaAlchemist, isDrying: false }],
      },
      {
        play: [chosenMerlin, otherMerlin, madamMim],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(aliceTeaAlchemist, {
        targets: [chosenMerlin],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.isExerted(chosenMerlin)).toBe(true);
    expect(testEngine.isExerted(otherMerlin)).toBe(true);
    expect(testEngine.isExerted(madamMim)).toBe(false);
  });
});
