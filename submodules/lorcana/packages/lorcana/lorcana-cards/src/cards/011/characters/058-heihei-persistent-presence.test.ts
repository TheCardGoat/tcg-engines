import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { heiheiPersistentPresence } from "./058-heihei-persistent-presence";

const challengeAttacker = createMockCharacter({
  id: "heihei-challenge-attacker",
  name: "Challenge Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const challengeDefender = createMockCharacter({
  id: "heihei-challenge-defender",
  name: "Challenge Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Heihei - Persistent Presence", () => {
  it("does not return to hand when banished outside a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: heiheiPersistentPresence, isDrying: false }],
        deck: 5,
      },
      {
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        deck: 5,
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(dragonFire, {
        targets: [heiheiPersistentPresence],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(heiheiPersistentPresence)).toBe("discard");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("returns to hand when banished while attacking in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: heiheiPersistentPresence, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: challengeDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(heiheiPersistentPresence, challengeDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(heiheiPersistentPresence)).toBe("hand");
  });

  it("returns to hand when banished while defending in a challenge", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: challengeAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: heiheiPersistentPresence, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(challengeAttacker, heiheiPersistentPresence),
    ).toBeSuccessfulCommand();
    if (testEngine.asPlayerTwo().getBagCount() > 0) {
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(heiheiPersistentPresence),
      ).toBeSuccessfulCommand();
    }

    expect(testEngine.asPlayerTwo().getCardZone(heiheiPersistentPresence)).toBe("hand");
  });
});
