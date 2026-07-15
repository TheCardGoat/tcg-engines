import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { potOfHoney } from "./067-pot-of-honey";

const stickyTarget = createMockCharacter({
  id: "pot-of-honey-sticky-target",
  name: "Sticky Target",
  cost: 2,
});

describe("Pot of Honey", () => {
  it("banishes itself to stop the chosen exerted character from readying at the start of their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        play: [potOfHoney],
      },
      {
        deck: 2,
        play: [{ card: stickyTarget, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(potOfHoney, {
        targets: [stickyTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(potOfHoney)).toBe("discard");
    expect(testEngine.hasRestriction(stickyTarget, "cant-ready")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(stickyTarget)).toBe(true);
  });
});
