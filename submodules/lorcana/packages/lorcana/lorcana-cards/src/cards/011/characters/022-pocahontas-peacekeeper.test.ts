import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { pocahontasPeacekeeper } from "./022-pocahontas-peacekeeper";

const shiftTarget = createMockCharacter({
  id: "poca-shift-target",
  name: "Pocahontas",
  version: "Base",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
});

const opponentCharacter = createMockCharacter({
  id: "poca-opponent-char",
  name: "Opponent Char",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Pocahontas - Peacekeeper", () => {
  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [pocahontasPeacekeeper],
      inkwell: pocahontasPeacekeeper.cost,
      deck: 5,
    });

    expect(testEngine.asPlayerOne().playCard(pocahontasPeacekeeper)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(pocahontasPeacekeeper)).toBe("play");
  });

  it("regression: cant-challenge restriction persists even after a quest is made", () => {
    const quester = createMockCharacter({
      id: "poca-quester",
      name: "Quester",
      cost: 2,
      strength: 2,
      willpower: 3,
      lore: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pocahontasPeacekeeper],
        play: [
          { card: shiftTarget, isDrying: false },
          { card: quester, isDrying: false },
        ],
        inkwell: 3,
        deck: 5,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 5,
      },
    );

    const shiftTargetId = testEngine.findCardInstanceId(shiftTarget, "play", PLAYER_ONE);

    // Shift Pocahontas onto the shift target (no challenges were made this turn)
    expect(
      testEngine.asPlayerOne().playCard(pocahontasPeacekeeper, {
        cost: { cost: "shift", shiftTarget: shiftTargetId },
      }),
    ).toBeSuccessfulCommand();

    // Resolve any bag effects from CALMING WORDS
    testEngine.asPlayerOne().resolveAllBagEffects({});

    // Now quest with the quester
    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();

    // After questing, the cant-challenge restriction should still be active
    // Trying to challenge with another ready character should fail
    // Pass to opponent turn to check restriction
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Opponent should not be able to challenge (restriction applies to all characters)
    const challengeResult = testEngine
      .asPlayerTwo()
      .challenge(opponentCharacter, pocahontasPeacekeeper);
    expect(challengeResult.success).toBe(false);
  });
});
