import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { fortisphere } from "./200-fortisphere";

const drawnCard = createMockCharacter({
  id: "fortisphere-draw",
  name: "Fortisphere Draw",
  cost: 1,
});

const guardedAlly = createMockCharacter({
  id: "fortisphere-ally",
  name: "Guarded Ally",
  cost: 2,
});

describe("Fortisphere", () => {
  it("lets you draw a card when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [fortisphere],
      inkwell: fortisphere.cost,
      deck: [drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(fortisphere)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(fortisphere)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 0,
        play: 1,
      }),
    );
  });

  it("grants Bodyguard until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        deck: 2,
        play: [fortisphere, guardedAlly],
      },
      {
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(fortisphere, {
        targets: [guardedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(guardedAlly, "Bodyguard")).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(fortisphere)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(guardedAlly, "Bodyguard")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(guardedAlly, "Bodyguard")).toBe(false);
  });
});
