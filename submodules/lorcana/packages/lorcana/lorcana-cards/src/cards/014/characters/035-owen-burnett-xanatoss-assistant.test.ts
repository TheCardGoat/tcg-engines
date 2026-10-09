import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  createMockLocation,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { owenBurnettXanatossAssistant } from "./035-owen-burnett-xanatoss-assistant";

const cheapOpponentCharacter = createMockCharacter({
  id: "owen-cheap-character",
  name: "Cheap Character",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const expensiveOpponentCharacter = createMockCharacter({
  id: "owen-expensive-character",
  name: "Expensive Character",
  cost: 4,
  strength: 4,
  willpower: 4,
});

const cheapOpponentItem = createMockItem({
  id: "owen-cheap-item",
  name: "Cheap Item",
  cost: 1,
});

describe("Owen Burnett - Xanatos's Assistant", () => {
  it("may return a chosen character with cost 2 or less to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [owenBurnettXanatossAssistant],
        inkwell: owenBurnettXanatossAssistant.cost,
        deck: 1,
      },
      {
        play: [cheapOpponentCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [cheapOpponentCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(cheapOpponentCharacter)).toBe("hand");
  });

  it("may return a chosen item with cost 2 or less to their player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [owenBurnettXanatossAssistant],
        inkwell: owenBurnettXanatossAssistant.cost,
        deck: 1,
      },
      {
        play: [cheapOpponentItem],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [cheapOpponentItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(cheapOpponentItem)).toBe("hand");
  });

  it("leaves the chosen permanent in play when declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [owenBurnettXanatossAssistant],
        inkwell: owenBurnettXanatossAssistant.cost,
        deck: 1,
      },
      {
        play: [cheapOpponentCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(cheapOpponentCharacter)).toBe("play");
  });

  it("cannot target a character with cost greater than 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [owenBurnettXanatossAssistant],
        inkwell: owenBurnettXanatossAssistant.cost,
        deck: 1,
      },
      {
        play: [expensiveOpponentCharacter],
        deck: 1,
      },
    );

    expect(testEngine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();

    // The harness completes this no-eligible-target trigger without a target choice.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getPendingEffects().length).toBe(0);
    expect(testEngine.asPlayerTwo().getCardZone(expensiveOpponentCharacter)).toBe("play");
  });
});

describe("Owen Burnett target boundaries", () => {
  it("lets player two choose an opposing permanent and returns it to its owner's hand", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [cheapOpponentCharacter], deck: 6 },
      { hand: [owenBurnettXanatossAssistant], inkwell: 3, deck: 6 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(
      engine.asPlayerTwo().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [cheapOpponentCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(cheapOpponentCharacter)).toBe("hand");
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    const targetId = engine.findCardInstanceId(cheapOpponentCharacter, "hand");
    expect(
      engine
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public),
    ).toContainEqual({
      key: "lorcana.outcome.cardReturnedToHand",
      values: { playerId: PLAYER_TWO, cardId: targetId },
    });
  });

  it("can return an owned location costing exactly two without returning its character", () => {
    const location = createMockLocation({
      id: "owen-location",
      name: "Cheap Location",
      cost: 2,
      moveCost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [owenBurnettXanatossAssistant],
      play: [location, cheapOpponentCharacter],
      inkwell: 4,
    });
    expect(
      engine.asPlayerOne().moveCharacterToLocation(cheapOpponentCharacter, location),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [location],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(location)).toBe("hand");
    expect(engine.asPlayerOne().getCardZone(cheapOpponentCharacter)).toBe("play");
    expect(engine.asPlayerOne()).not.toBeAtLocation({ card: cheapOpponentCharacter, location });
  });

  it("rejects a costly target while eligible targets exist and leaves the choice pending", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [owenBurnettXanatossAssistant], inkwell: 3 },
      { play: [cheapOpponentCharacter, expensiveOpponentCharacter] },
    );
    expect(engine.asPlayerOne().playCard(owenBurnettXanatossAssistant)).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [expensiveOpponentCharacter],
      }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(expensiveOpponentCharacter)).toBe("play");
    expect(
      engine.asPlayerOne().resolvePendingByCard(owenBurnettXanatossAssistant, {
        resolveOptional: true,
        targets: [cheapOpponentCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getCardZone(cheapOpponentCharacter)).toBe("hand");
  });
});

it("Player Two returns its own exact-two item and finishes a later entry with no eligible permanent", () => {
  const item = createMockItem({ id: "owen-own-two-item", name: "Own Two Item", cost: 2 });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [expensiveOpponentCharacter], deck: 6 },
    {
      hand: [owenBurnettXanatossAssistant, owenBurnettXanatossAssistant],
      play: [item],
      inkwell: 6,
      deck: 6,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerTwo()
      .playCard(game.findCardInstanceId(owenBurnettXanatossAssistant, "hand", PLAYER_TWO)),
  ).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(owenBurnettXanatossAssistant, {
      resolveOptional: true,
      targets: [item],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(item)).toBe("hand");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  const before = game
    .asServer()
    .getMoveLogHistory()
    .flatMap((log) => log.public)
    .filter((message) => message.key === "lorcana.outcome.cardReturnedToHand");
  expect(before).toHaveLength(1);
  expect(
    game
      .asPlayerTwo()
      .playCard(game.findCardInstanceId(owenBurnettXanatossAssistant, "hand", PLAYER_TWO)),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerTwo().getBagCount()).toBe(0);
  expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
  expect(game.asPlayerOne().getCardZone(expensiveOpponentCharacter)).toBe("play");
  expect(
    game
      .asServer()
      .getMoveLogHistory()
      .flatMap((log) => log.public)
      .filter((message) => message.key === "lorcana.outcome.cardReturnedToHand"),
  ).toEqual(before);
});
