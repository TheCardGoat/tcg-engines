// CR 2.2.0: 4.3.2.3/4.3.6 payment modifiers and alternate costs; 6.4.2.2 duration.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  createMockItem,
  createMockLocation,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { shift } from "../../../helpers/abilities/shift";
import { mrManchasServiceWithASmile } from "./013-mr-manchas-service-with-a-smile";

const priceyAlly = createMockCharacter({ id: "manchas-ally", name: "Ally", cost: 4 });

describe("Mr. Manchas - Service with a Smile", () => {
  it("on quest, discounts the next character play by 1 {I}", () => {
    // Exactly 3 ready ink: the 4-cost ally is only playable at its discounted
    // cost of 3 — at full price the play is refused, so the test proves the
    // reduction rather than raw affordability.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [mrManchasServiceWithASmile, priceyAlly],
        inkwell: 3,
        deck: 6,
      },
      { deck: 6 },
    );

    expect(testEngine.asPlayerOne().playCard(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(priceyAlly)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(priceyAlly)).toBe("play");
    expect(testEngine.asPlayerOne().hasGameEnded()).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("reduces only the next character's cost", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrManchasServiceWithASmile],
      hand: [priceyAlly, priceyAlly],
      inkwell: 6,
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(priceyAlly)).toBeSuccessfulCommand();
    expect(engine.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(engine.asPlayerOne().playCard(priceyAlly)).not.toBeSuccessfulCommand();
  });

  it("does not consume the character discount when an action is played", () => {
    const action = createMockAction({ id: "manchas-action", name: "Action", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrManchasServiceWithASmile],
      hand: [action, priceyAlly],
      inkwell: 4,
      deck: 3,
    });
    expect(engine.asPlayerOne().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(action)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(priceyAlly)).toBeSuccessfulCommand();
    expect(engine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("expires an unused discount at the end of the turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [mrManchasServiceWithASmile], hand: [priceyAlly], inkwell: 3, deck: 3 },
      { deck: 3 },
    );
    expect(engine.asPlayerOne().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(priceyAlly)).not.toBeSuccessfulCommand();
    expect(engine.asServer().getAvailableInk(PLAYER_ONE)).toBe(3);
  });

  it("stacks two quest discounts for one character and consumes both", () => {
    const secondManchas = { ...mrManchasServiceWithASmile, id: "manchas-second" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mrManchasServiceWithASmile, secondManchas],
      hand: [priceyAlly, priceyAlly],
      inkwell: 5,
      deck: 6,
    });
    expect(game.asPlayerOne().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(secondManchas)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().playCard(game.findCardInstanceId(priceyAlly, "hand", PLAYER_ONE)),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().playCard(priceyAlly).success).toBe(false);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
  });
  it("discounts Player Two's next character without changing Player One's ink", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { inkwell: 2, deck: 6 },
      { play: [mrManchasServiceWithASmile], hand: [priceyAlly], inkwell: 3, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().playCard(priceyAlly)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(game.asPlayerTwo().getCardZone(priceyAlly)).toBe("play");
  });
});

it("Player Two exact quest discounts survive source return and non-character plays", () => {
  const bounce = createMockAction({
    id: "manchas-return",
    name: "Return Manchas",
    cost: 1,
    abilities: [{ type: "action", effect: { type: "return-to-hand", target: "CHOSEN_CHARACTER" } }],
  });
  const item = createMockItem({ id: "manchas-item", name: "Item", cost: 1 });
  const location = createMockLocation({ id: "manchas-location", name: "Location", cost: 1 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { inkwell: 4, hand: [priceyAlly], deck: 6 },
    {
      play: [mrManchasServiceWithASmile, mrManchasServiceWithASmile],
      hand: [bounce, item, location, priceyAlly, priceyAlly],
      inkwell: 6,
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  const allies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => game.asServer().getCardDefinitionByInstanceId(id).id === priceyAlly.id);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(bounce, { targets: [copies[0]] })).toBeSuccessfulCommand();
  expect(game.asServer().getCard(copies[0]).zone).toBe("hand");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(5);
  expect(game.asPlayerTwo().playCard(item)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(location)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().playCard(allies[0])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().playCard(allies[1])).not.toBeSuccessfulCommand();
  expect(game.asServer().getCard(allies[1]).zone).toBe("hand");
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().playCard(game.findCardInstanceId(priceyAlly, "hand", PLAYER_ONE)),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("consumes stacked discounts on a zero-cost character and expires unused Player Two discounts", () => {
  const free = createMockCharacter({ id: "manchas-free", name: "Free Character", cost: 0 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    {
      play: [mrManchasServiceWithASmile, mrManchasServiceWithASmile],
      hand: [free, priceyAlly],
      inkwell: 3,
      deck: 6,
    },
  );
  const copies = game.getCardInstanceIdsInZone("play", PLAYER_TWO);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const copy of copies) expect(game.asPlayerTwo().quest(copy)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(free)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().playCard(priceyAlly)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(copies[1])).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(priceyAlly)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(3);
  expect(game.asPlayerTwo().getCardZone(priceyAlly)).toBe("hand");
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});

it("reduces Player Two's alternate Shift payment", () => {
  const base = createMockCharacter({ id: "manchas-shift-base", name: "Shift Character", cost: 1 });
  const shifted = createMockCharacter({
    id: "manchas-shifted",
    name: "Shift Character",
    cost: 6,
    abilities: [shift(4)],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 6 },
    { play: [mrManchasServiceWithASmile, base], hand: [shifted], inkwell: 3, deck: 6 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().quest(mrManchasServiceWithASmile)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().playCard(shifted, {
      cost: { cost: "shift", shiftTarget: game.findCardInstanceId(base, "play", PLAYER_TWO) },
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getCardsUnderCount(shifted)).toBe(1);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
});
