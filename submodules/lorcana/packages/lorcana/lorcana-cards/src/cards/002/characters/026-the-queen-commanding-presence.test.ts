import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theQueenCommandingPresence } from "./026-the-queen-commanding-presence";

const friendlyTarget = createMockCharacter({
  id: "queen-friendly-target",
  name: "Queen Friendly Target",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opposingTarget = createMockCharacter({
  id: "queen-opposing-target",
  name: "Queen Opposing Target",
  cost: 2,
  strength: 5,
  willpower: 5,
  lore: 1,
});

describe("The Queen - Commanding Presence", () => {
  it("collects targets one at a time and only resolves after both are chosen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [theQueenCommandingPresence, friendlyTarget],
        deck: 1,
      },
      {
        play: [opposingTarget],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().quest(theQueenCommandingPresence)).toBeSuccessfulCommand();

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    if (!bagEffect) {
      return;
    }

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theQueenCommandingPresence),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.strength).toBe(
      opposingTarget.strength,
    );
    expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
      friendlyTarget.strength,
    );

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opposingTarget] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.strength).toBe(
      opposingTarget.strength,
    );
    expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
      friendlyTarget.strength,
    );

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [friendlyTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCard(opposingTarget)?.strength).toBe(
      opposingTarget.strength - 4,
    );
    expect(testEngine.asPlayerOne().getCard(friendlyTarget)?.strength).toBe(
      friendlyTarget.strength + 4,
    );
  });
});
