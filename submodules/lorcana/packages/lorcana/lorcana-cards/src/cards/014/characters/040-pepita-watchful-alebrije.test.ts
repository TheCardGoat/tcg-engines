import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { pepitaWatchfulAlebrije } from "./040-pepita-watchful-alebrije";

const strayCur = createMockCharacter({
  id: "pepita-test-stray-cur",
  name: "Stray Cur",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Pepita - Watchful Alebrije", () => {
  it("adds exactly two strength for player two's challenge and removes it afterward", () => {
    const defender = createMockCharacter({
      id: "pepita-exact-defender",
      name: "Defender",
      cost: 2,
      strength: 1,
      willpower: 5,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: defender, exerted: true }], deck: 6 },
      { play: [pepitaWatchfulAlebrije], deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
    expect(
      engine.asPlayerTwo().challenge(pepitaWatchfulAlebrije, defender),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getDamage(defender)).toBe(4);
    expect(engine.asPlayerOne().getCardZone(defender)).toBe("play");
    expect(engine.asPlayerTwo().getDamage(pepitaWatchfulAlebrije)).toBe(1);
    expect(engine.asPlayerTwo().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
    expect(engine.isExerted(pepitaWatchfulAlebrije)).toBe(true);
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_TWO)).toBe(0);
  });
  it("has Challenger +2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [pepitaWatchfulAlebrije],
      deck: 2,
    });

    expect(testEngine.getKeywordValue(pepitaWatchfulAlebrije, "Challenger")).toBe(2);
  });

  it("deals +2 damage while challenging, banishing a 3-willpower defender its base 2 {S} could not", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: pepitaWatchfulAlebrije, isDrying: false }],
        deck: 2,
      },
      {
        play: [{ card: strayCur, exerted: true }],
        deck: 2,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(pepitaWatchfulAlebrije, strayCur),
    ).toBeSuccessfulCommand();

    // 2 {S} + 2 Challenger = 4 damage ≥ 3 {W}: the defender is banished.
    expect(testEngine.asPlayerTwo().getCardZone(strayCur)).toBe("discard");
    // Pepita only takes the defender's 2 {S} and survives on 3 {W}.
    expect(testEngine.asPlayerOne().getCardZone(pepitaWatchfulAlebrije)).toBe("play");
  });
  // CR 8.5.2: Challenger does not apply while being challenged.
  it("deals only base strength when challenged and does not keep the attack bonus", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: pepitaWatchfulAlebrije, exerted: true }], deck: 2 },
      { play: [{ card: strayCur, isDrying: false }], deck: 2 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().challenge(strayCur, pepitaWatchfulAlebrije),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(strayCur)).toBe("play");
    expect(engine.asPlayerTwo().getDamage(strayCur)).toBe(2);
    expect(engine.asPlayerOne().getDamage(pepitaWatchfulAlebrije)).toBe(2);
    expect(engine.asPlayerOne().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
  });

  it("uses printed lore and base strength when questing", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: pepitaWatchfulAlebrije, isDrying: false }],
      deck: [],
    });
    expect(engine.asPlayerOne().quest(pepitaWatchfulAlebrije)).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.isExerted(pepitaWatchfulAlebrije)).toBe(true);
    expect(engine.asPlayerOne().getCard(pepitaWatchfulAlebrije).strength).toBe(2);
    expect(engine.asPlayerOne().getCard(pepitaWatchfulAlebrije).lore).toBe(1);
  });
});
