import { describe, expect, it } from "bun:test";
import {
  createMockCharacter,
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { brutusFearsomeCrocodile } from "./125-brutus-fearsome-crocodile";

const damagedAlly = createMockCharacter({
  id: "brutus-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingDefender = createMockCharacter({
  id: "brutus-opposing-defender",
  name: "Opposing Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
});

describe("Brutus - Fearsome Crocodile", () => {
  it("SPITEFUL - gains 2 lore when this character is banished during your turn after one of your characters was damaged this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [brutusFearsomeCrocodile, { card: damagedAlly, isDrying: false }],
      },
      {
        play: [{ card: opposingDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine.asPlayerOne().challenge(damagedAlly, opposingDefender),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualSetDamage(brutusFearsomeCrocodile, 4),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(brutusFearsomeCrocodile)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });

  it("SPITEFUL - does not gain lore when this character is banished during an opponent's turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [brutusFearsomeCrocodile, { card: damagedAlly, isDrying: false }],
      },
      {
        play: [{ card: opposingDefender, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(damagedAlly, opposingDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualSetDamage(brutusFearsomeCrocodile, 4),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(brutusFearsomeCrocodile)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
