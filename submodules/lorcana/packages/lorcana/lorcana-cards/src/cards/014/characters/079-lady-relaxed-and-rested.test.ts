import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { grabYourSword } from "../../001/actions/198-grab-your-sword";
import { distract } from "../../003/actions/159-distract";
import { ladyRelaxedAndRested } from "./079-lady-relaxed-and-rested";

const otherCharacter = createMockCharacter({
  id: "lady-test-other-character",
  name: "Unguarded Friend",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Lady - Relaxed and Rested", () => {
  it("has Ward and cannot be chosen by an opponent's effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [ladyRelaxedAndRested, otherCharacter],
        deck: 6,
      },
      {
        hand: [distract],
        inkwell: distract.cost,
        deck: 6,
      },
    );

    const cardUnderTest = testEngine.asPlayerOne();
    expect(cardUnderTest).toHaveKeyword({
      card: ladyRelaxedAndRested,
      keyword: "Ward",
    });

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().playCard(distract, { targets: [ladyRelaxedAndRested] }),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ladyRelaxedAndRested)).toBe("play");
    expect(testEngine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(distract.cost);
    expect(testEngine.asPlayerTwo().getCardZone(distract)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardStrength(ladyRelaxedAndRested)).toBe(3);
  });

  it("can still be chosen by your own effects", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [ladyRelaxedAndRested],
        hand: [distract],
        inkwell: distract.cost,
        deck: 6,
      },
      {
        deck: 6,
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(distract, { targets: [ladyRelaxedAndRested] }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardStrength(ladyRelaxedAndRested)).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });
});

it("Ward does not prevent a legal challenge", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [{ card: ladyRelaxedAndRested, exerted: true }], deck: 6 },
    { play: [{ card: otherCharacter, isDrying: false }], deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().challenge(otherCharacter, ladyRelaxedAndRested),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(ladyRelaxedAndRested)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(otherCharacter)).toBe("discard");
});
it("non-chosen opposing damage still affects Lady", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [ladyRelaxedAndRested, otherCharacter], deck: 6 },
    { hand: [grabYourSword], inkwell: 5, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(grabYourSword)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(ladyRelaxedAndRested)).toBe("discard");
  expect(game.asPlayerOne().getDamage(otherCharacter)).toBe(2);
});
it("quests for one lore", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [{ card: ladyRelaxedAndRested, isDrying: false }],
    deck: 6,
  });
  expect(game.asPlayerOne().quest(ladyRelaxedAndRested)).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().isExerted(ladyRelaxedAndRested)).toBe(true);
});
it("plays for one ink and has printed strength", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [ladyRelaxedAndRested],
    inkwell: 1,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(ladyRelaxedAndRested)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardStrength(ladyRelaxedAndRested)).toBe(3);
  expect(game.asPlayerOne().quest(ladyRelaxedAndRested)).not.toBeSuccessfulCommand();
});

it("player two cannot ink Lady and pays one ink to play her", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { hand: [ladyRelaxedAndRested], inkwell: 1, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().ink(ladyRelaxedAndRested)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(ladyRelaxedAndRested)).toBe("hand");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().playCard(ladyRelaxedAndRested)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo()).toHaveKeyword({ card: ladyRelaxedAndRested, keyword: "Ward" });
  expect(game.asPlayerTwo().quest(ladyRelaxedAndRested)).not.toBeSuccessfulCommand();
});
it("Ward protects player two from player one's chosen effect", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [distract], inkwell: 1, deck: 6 },
    { play: [ladyRelaxedAndRested], deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(distract, { targets: [ladyRelaxedAndRested] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(distract)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerTwo().getCardStrength(ladyRelaxedAndRested)).toBe(3);
});
