import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { cruellaDeVilMiserableAsUsual } from "./072-cruella-de-vil-miserable-as-usual";

const challenger = createMockCharacter({
  id: "cruella-test-challenger",
  name: "Test Challenger",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Cruella De Vil - Miserable as Usual", () => {
  it("can return the challenging character to hand when Cruella is challenged and banished", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [challenger],
      },
      {
        deck: 1,
        play: [{ card: cruellaDeVilMiserableAsUsual, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challenger, cruellaDeVilMiserableAsUsual),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(cruellaDeVilMiserableAsUsual, {
        resolveOptional: true,
        targets: [challenger],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(challenger)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(cruellaDeVilMiserableAsUsual)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
      expect.objectContaining({ hand: 1, play: 0 }),
    );
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_TWO)).toEqual(
      expect.objectContaining({ discard: 1, play: 0 }),
    );
  });

  it("allows the controller to decline the return-to-hand option", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [challenger],
      },
      {
        deck: 1,
        play: [{ card: cruellaDeVilMiserableAsUsual, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challenger, cruellaDeVilMiserableAsUsual),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerTwo().getBagEffects();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(cruellaDeVilMiserableAsUsual, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(challenger)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(cruellaDeVilMiserableAsUsual)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_ONE)).toEqual(
      expect.objectContaining({ play: 1, discard: 0 }),
    );
    expect(testEngine.asPlayerOne().getZonesCardCount(PLAYER_TWO)).toEqual(
      expect.objectContaining({ discard: 1, play: 0 }),
    );
  });
});
