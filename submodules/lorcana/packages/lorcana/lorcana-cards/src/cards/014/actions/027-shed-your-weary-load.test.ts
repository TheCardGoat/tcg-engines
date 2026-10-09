import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
  createMockAction,
  createMockLocation,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { shedYourWearyLoad } from "./027-shed-your-weary-load";

const keeperCharacter = createMockCharacter({
  id: "shed-keeper",
  name: "Kept Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const discardedItem = createMockItem({ id: "shed-item", name: "Discarded Item", cost: 2 });
const discardedAction = createMockAction({ id: "shed-action", name: "Discarded Action", cost: 2 });

describe("Shed Your Weary Load", () => {
  it("Player Two sings for free and discards every opposing non-character without touching their own hand", () => {
    const singer = createMockCharacter({ id: "shed-p2-singer", name: "Singer", cost: 5 });
    const location = createMockLocation({ id: "shed-p2-location", name: "Location", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [keeperCharacter, discardedItem, discardedAction, location], deck: 6 },
      { hand: [shedYourWearyLoad, singer], play: [singer], inkwell: 2, deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const songId = game.findCardInstanceId(shedYourWearyLoad, "hand", PLAYER_TWO);
    const singerId = game.findCardInstanceId(singer, "play", PLAYER_TWO);
    expect(game.asPlayerTwo().singSong(songId, singerId)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
    expect(game.asPlayerTwo().isExerted(singerId)).toBe(true);
    expect(game.asPlayerTwo().getCardZone(songId)).toBe("discard");
    for (const card of [discardedItem, discardedAction, location]) {
      expect(game.asPlayerOne().getCardZone(card)).toBe("discard");
    }
    expect(game.asPlayerOne().getCardZone(keeperCharacter)).toBe("hand");
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(
      game.asPlayerTwo().getCardZone(game.findCardInstanceId(singer, "hand", PLAYER_TWO)),
    ).toBe("hand");
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerTwo().hasGameEnded()).toBe(false);
  });

  it("Player Two empties an all-non-character hand and logs exact public discard identities", () => {
    const singer = createMockCharacter({ id: "shed-all-singer", name: "Singer", cost: 5 });
    const location = createMockLocation({ id: "shed-all-location", name: "Location", cost: 1 });
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [discardedAction, discardedItem, location], deck: 6 },
      { hand: [shedYourWearyLoad, keeperCharacter], play: [singer], deck: 6 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const ids = [discardedAction, discardedItem, location].map((card) =>
      game.findCardInstanceId(card, "hand", PLAYER_ONE),
    );
    expect(game.asPlayerTwo().singSong(shedYourWearyLoad, singer)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().discard).toBe(3);
    for (const id of ids) expect(game.asPlayerOne().getCardZone(id)).toBe("discard");
    expect(game.asPlayerTwo().getCardZone(keeperCharacter)).toBe("hand");
    expect(game.asPlayerTwo().getBagCount()).toBe(0);
    expect(game.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    const log = game
      .asServer()
      .getMoveLogHistory()
      .find((log) => log.moveType === "singCard");
    expect(log?.public).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsDiscarded.detail",
          values: { playerId: PLAYER_ONE, amount: 3, cardIds: ids },
        }),
      ]),
    );
  });

  it("rejects insufficient paid ink without revealing or discarding the opponent's hand", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [shedYourWearyLoad], inkwell: 4, deck: 6 },
      { hand: [keeperCharacter, discardedItem], deck: 6 },
    );
    expect(game.asPlayerOne().playCard(shedYourWearyLoad)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerOne().getCardZone(shedYourWearyLoad)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(discardedItem)).toBe("hand");
    expect(game.asPlayerTwo().getZonesCardCount().discard).toBe(0);
    expect(game.getAuthoritativeState().ctx.zones.reveals.active).toHaveLength(0);
  });
  it("chosen opponent reveals their hand and discards each non-character card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shedYourWearyLoad],
        inkwell: shedYourWearyLoad.cost,
      },
      {
        hand: [keeperCharacter, discardedItem, discardedAction],
      },
    );

    expect(testEngine.asPlayerOne().playCard(shedYourWearyLoad)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(discardedItem)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(discardedAction)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(keeperCharacter)).toBe("hand");
    expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(1);
    expect(
      testEngine
        .asServer()
        .getMoveLogHistory()
        .find((log) => log.moveType === "playCard")?.public,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "lorcana.outcome.cardsDiscarded.detail",
          values: {
            playerId: PLAYER_TWO,
            amount: 2,
            cardIds: [
              testEngine.findCardInstanceId(discardedItem, "discard", PLAYER_TWO),
              testEngine.findCardInstanceId(discardedAction, "discard", PLAYER_TWO),
            ],
          },
        }),
      ]),
    );
  });

  it("leaves the hand untouched when it only holds characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [shedYourWearyLoad],
        inkwell: shedYourWearyLoad.cost,
      },
      {
        hand: [keeperCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(shedYourWearyLoad)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(keeperCharacter)).toBe("hand");
    expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
  });
  it("discards locations too, reveals characters publicly, and keeps your own hand", () => {
    const location = createMockLocation({ id: "shed-location", name: "Location", cost: 1 });
    const ownCard = createMockAction({ id: "shed-own-action", name: "Own Action", cost: 1 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [shedYourWearyLoad, ownCard], inkwell: 5, deck: 6 },
      { hand: [keeperCharacter, discardedItem, discardedAction, location], deck: 6 },
    );
    expect(engine.asPlayerOne().playCard(shedYourWearyLoad)).toBeSuccessfulCommand();
    expect(engine.asPlayerOne().getCardZone(ownCard)).toBe("hand");
    for (const card of [discardedItem, discardedAction, location])
      expect(engine.asPlayerTwo().getCardZone(card)).toBe("discard");
    const characterId = engine.findCardInstanceId(keeperCharacter, "hand", "player_two");
    expect(
      engine
        .getAuthoritativeState()
        .ctx.zones.reveals.active.some(
          (window) => window.visibleTo === "all" && window.cardIDs.includes(characterId),
        ),
    ).toBe(true);
  });

  it("finishes with an empty opposing hand and can be sung without ink", () => {
    const singer = createMockCharacter({ id: "shed-singer", name: "Singer", cost: 5 });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [shedYourWearyLoad], play: [singer], deck: 6 },
      { hand: [], deck: 6 },
    );
    expect(engine.asPlayerOne().singSong(shedYourWearyLoad, singer)).toBeSuccessfulCommand();
    expect(engine.isExerted(singer)).toBe(true);
    expect(engine.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(engine.asPlayerTwo().getZonesCardCount().discard).toBe(0);
  });
});
