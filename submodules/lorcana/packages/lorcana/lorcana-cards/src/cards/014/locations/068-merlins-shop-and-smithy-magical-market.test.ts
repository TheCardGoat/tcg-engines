import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { merlinsShopAndSmithyMagicalMarket } from "./068-merlins-shop-and-smithy-magical-market";

const traveler = createMockCharacter({
  id: "merlins-shop-traveler",
  name: "Merlin's Shop Traveler",
  cost: 2,
});

const secondTraveler = createMockCharacter({
  id: "merlins-shop-second-traveler",
  name: "Merlin's Shop Second Traveler",
  cost: 2,
});

const otherLocation = createMockLocation({
  id: "merlins-shop-other-location",
  name: "Merlin's Shop Other Location",
  cost: 1,
  moveCost: 1,
  lore: 0,
});

describe("Merlin's Shop and Smithy - Magical Market", () => {
  it("Open for Business - draws a card and gains 1 lore the first time a character moves here during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinsShopAndSmithyMagicalMarket, { card: traveler, exerted: true }],
      inkwell: merlinsShopAndSmithyMagicalMarket.moveCost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket)
        .success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Open for Business - only triggers once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        merlinsShopAndSmithyMagicalMarket,
        { card: traveler, exerted: true },
        { card: secondTraveler, exerted: true },
      ],
      inkwell: merlinsShopAndSmithyMagicalMarket.moveCost * 2,
      deck: 4,
    });

    expect(
      testEngine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket)
        .success,
    ).toBe(true);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);

    expect(
      testEngine
        .asPlayerOne()
        .moveCharacterToLocation(secondTraveler, merlinsShopAndSmithyMagicalMarket).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Open for Business - does not trigger when a character moves to a different location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinsShopAndSmithyMagicalMarket, otherLocation, { card: traveler, exerted: true }],
      inkwell: otherLocation.moveCost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation).success).toBe(
      true,
    );
    expect(testEngine.asPlayerOne().getBagEffects()).toHaveLength(0);

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
  it("only rewards the controller when a drying character moves here", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [merlinsShopAndSmithyMagicalMarket, { card: traveler, isDrying: true }],
        inkwell: 2,
        deck: 3,
      },
      { lore: 4, deck: 3 },
    );
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerOne()).toBeAtLocation({
      card: traveler,
      location: merlinsShopAndSmithyMagicalMarket,
    });
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.getLore(PLAYER_TWO)).toBe(4);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(3);
  });

  it("does not reward a move here on the opposing turn", () => {
    const move = createMockAction({
      id: "shop-opponent-move",
      name: "Move Rivals",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "move-to-location",
            cost: "free",
            character: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            location: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["location"],
            },
          },
        },
      ],
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinsShopAndSmithyMagicalMarket, traveler], deck: 5 },
      { hand: [move], inkwell: 1, deck: 5 },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().playCard(move)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne()).toBeAtLocation({
      card: traveler,
      location: merlinsShopAndSmithyMagicalMarket,
    });
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.getLore(PLAYER_TWO)).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(5);
  });

  it("does not reward returning twice in one turn but resets on the next own turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinsShopAndSmithyMagicalMarket, otherLocation, traveler], inkwell: 6, deck: 6 },
      { deck: 6 },
    );
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, otherLocation),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(2);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("does not move or grant rewards when the move cost cannot be paid", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [merlinsShopAndSmithyMagicalMarket, traveler],
      inkwell: 1,
      deck: 3,
    });
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).not.toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(3);
  });

  // CR 6.1.13.1-2: the controller's turn and independent full resolutions.
  it("Player Two's exact Markets reward independently and reset on their next own turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinsShopAndSmithyMagicalMarket], lore: 4, deck: 8 },
      {
        play: [merlinsShopAndSmithyMagicalMarket, merlinsShopAndSmithyMagicalMarket, traveler],
        inkwell: 8,
        deck: 8,
      },
    );
    const markets = engine
      .getCardInstanceIdsInZone("play", PLAYER_TWO)
      .filter(
        (id) =>
          engine.asServer().getCardDefinitionByInstanceId(id).id ===
          merlinsShopAndSmithyMagicalMarket.id,
      );
    const travelerId = engine.findCardInstanceId(traveler, "play", PLAYER_TWO);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = engine.asPlayerTwo().getZonesCardCount();
    for (const market of markets) {
      expect(
        engine.asPlayerTwo().moveCharacterToLocation(travelerId, market),
      ).toBeSuccessfulCommand();
    }
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 2);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 2);
    for (const market of markets) {
      expect(
        engine.asPlayerTwo().moveCharacterToLocation(travelerId, market),
      ).toBeSuccessfulCommand();
    }
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 2);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 2);
    expect(engine.asPlayerTwo().getBagCount()).toBe(0);
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const nextTurn = engine.asPlayerTwo().getZonesCardCount();
    for (const market of markets) {
      expect(
        engine.asPlayerTwo().moveCharacterToLocation(travelerId, market),
      ).toBeSuccessfulCommand();
    }
    expect(engine.getLore(PLAYER_TWO)).toBe(4);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(nextTurn.hand + 2);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(nextTurn.deck - 2);
    expect(engine.getLore(PLAYER_ONE)).toBe(4);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(7);
  });

  it("still gains lore when its draw finds an empty deck", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [merlinsShopAndSmithyMagicalMarket, traveler], inkwell: 2, deck: [] },
      { deck: 3 },
    );
    expect(
      engine.asPlayerOne().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.getLore(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(engine.asPlayerOne().hasGameEnded()).toBe(false);
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(engine.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it("player two pays both moves, receives one reward, and resets on their next turn", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { lore: 4, deck: 6 },
      {
        play: [merlinsShopAndSmithyMagicalMarket, otherLocation, traveler, secondTraveler],
        inkwell: 4,
        deck: 6,
      },
    );
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = engine.asPlayerTwo().getZonesCardCount();
    expect(
      engine.asPlayerTwo().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(
      engine
        .asPlayerTwo()
        .moveCharacterToLocation(secondTraveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(engine.getLore(PLAYER_TWO)).toBe(1);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(engine.asPlayerTwo()).toBeAtLocation({
      card: traveler,
      location: merlinsShopAndSmithyMagicalMarket,
    });
    expect(engine.asPlayerTwo()).toBeAtLocation({
      card: secondTraveler,
      location: merlinsShopAndSmithyMagicalMarket,
    });
    expect(engine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const nextTurn = engine.asPlayerTwo().getZonesCardCount();
    expect(
      engine.asPlayerTwo().moveCharacterToLocation(traveler, otherLocation),
    ).toBeSuccessfulCommand();
    expect(
      engine.asPlayerTwo().moveCharacterToLocation(traveler, merlinsShopAndSmithyMagicalMarket),
    ).toBeSuccessfulCommand();
    expect(engine.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(1);
    expect(engine.getLore(PLAYER_TWO)).toBe(2);
    expect(engine.asPlayerTwo().getZonesCardCount().hand).toBe(nextTurn.hand + 1);
    expect(engine.asPlayerTwo().getZonesCardCount().deck).toBe(nextTurn.deck - 1);
    expect(engine.getLore(PLAYER_ONE)).toBe(4);
  });
});
