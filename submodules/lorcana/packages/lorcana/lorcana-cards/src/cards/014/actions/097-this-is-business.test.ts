import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { thisIsBusiness } from "./097-this-is-business";

const opponentHandItem = createMockItem({ id: "business-item", name: "Hand Item", cost: 2 });
const opponentHandCharacter = createMockCharacter({
  id: "business-character",
  name: "Hand Character",
  cost: 2,
});
const deckFiller = createMockCharacter({ id: "business-deck", name: "Deck Filler", cost: 1 });

for (const mode of [0, 1]) {
  it(`player two plays mode ${mode} with player one choosing and rewards the correct owner`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opponentHandItem], deck: 6, inkDrops: 4 },
      { hand: [thisIsBusiness], deck: [opponentHandCharacter, deckFiller], inkDrops: 3 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const target = game.findCardInstanceId(opponentHandItem, "hand", PLAYER_ONE);
    const drawn = game.findCardInstanceId(opponentHandCharacter, "deck", PLAYER_TWO);
    expect(
      game.asPlayerTwo().playCard(thisIsBusiness, { targets: [PLAYER_ONE], inkDrops: 3 }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().respondWithChoice(mode)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().respondWithChoice(mode)).toBeSuccessfulCommand();
    if (mode === 0) {
      expect(game.asPlayerOne().respondWith(target)).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().respondWith(target)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(target)).toBe("discard");
      expect(game.asPlayerTwo().getCardZone(drawn)).toBe("deck");
    } else {
      expect(game.asPlayerOne().getCardZone(target)).toBe("hand");
      expect(game.asPlayerTwo().getCardZone(drawn)).toBe("hand");
      const publicLog = JSON.stringify(
        game
          .getServerEngine()
          .getRuntime()
          .getMoveLogHistory()
          .flatMap((entry) => entry.public),
      );
      expect(publicLog).not.toContain(drawn);
    }
    expect(game.getInkDrops(PLAYER_ONE)).toBe(mode === 0 ? 6 : 4);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(mode === 1 ? 2 : 0);
  });
}

describe("This Is Business", () => {
  it("option 1 (opponent's choice): they reveal, you discard a card of your choice, they get 2 ink drops", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [thisIsBusiness],
        inkwell: thisIsBusiness.cost,
        deck: [deckFiller],
      },
      {
        hand: [opponentHandItem, opponentHandCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();

    // The chosen opponent picks the first mode.
    expect(testEngine.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();

    // You pick which revealed card they discard.
    expect(testEngine.asPlayerOne().respondWith(opponentHandItem)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentHandItem)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandCharacter)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(2);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("option 2: you draw a card and get 2 ink drops", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [thisIsBusiness],
        inkwell: thisIsBusiness.cost,
        deck: [deckFiller],
      },
      {
        hand: [opponentHandItem],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandItem)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(2);
    expect(testEngine.getInkDrops(PLAYER_TWO)).toBe(0);
  });
});

it("rejects choosing yourself or multiple players before payment", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 3, deck: 6 },
    { deck: 6 },
  );
  for (const targets of [[PLAYER_ONE], [PLAYER_ONE, PLAYER_TWO], [PLAYER_TWO, PLAYER_TWO]]) {
    expect(game.asPlayerOne().playCard(thisIsBusiness, { targets })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(3);
    expect(game.asPlayerOne().getCardZone(thisIsBusiness)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  }
});

it("only the chosen opponent picks the mode and only you choose their discarded card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness, deckFiller], inkwell: 3, deck: 6 },
    { hand: [opponentHandItem, opponentHandCharacter], deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWithChoice(1)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(opponentHandItem)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(deckFiller)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(opponentHandCharacter)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentHandCharacter)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(opponentHandItem)).toBe("hand");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("the empty-hand reveal mode still grants the opponent two drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 3, deck: 6 },
    { hand: [], deck: 6, inkDrops: 3 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(5);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
});

it("the draw mode adds two to your existing pool and preserves the opposing hand and pool", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 3, deck: [deckFiller], inkDrops: 3 },
    { hand: [opponentHandItem], deck: 6, inkDrops: 4 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("hand");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(5);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerTwo().getCardZone(opponentHandItem)).toBe("hand");
});

it("requires three ink and cannot use a future reward to pay", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 2, deck: 6 },
    { deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});

it("saved drops pay the action and the draw-mode reward pays a new character", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkDrops: 3, deck: [deckFiller] },
    { deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO], inkDrops: 3 }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().playCard(deckFiller, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
});

it("empty-deck draw still grants two drops and loses at the turn boundary", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 3, deck: [] },
    { deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
});

it("is inkable", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [thisIsBusiness] });
  expect(game.asPlayerOne().ink(thisIsBusiness)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(thisIsBusiness)).toBe("inkwell");
});

it("cannot skip the required discard from a nonempty revealed hand", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [thisIsBusiness], inkwell: 3, deck: 6 },
    { hand: [opponentHandItem], deck: 6 },
  );
  expect(
    game.asPlayerOne().playCard(thisIsBusiness, { targets: [PLAYER_TWO] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWithChoice(0)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolveNextPending({ targets: [] })).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentHandItem)).toBe("hand");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.asPlayerOne().respondWith(opponentHandItem)).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
});

for (const mode of [0, 1]) {
  it(`Player Two mode ${mode} rejects invalid choices and retains the correct reward through turns`, () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [opponentHandItem, deckFiller], inkDrops: 4, deck: 8 },
      { hand: [thisIsBusiness, deckFiller], inkDrops: 3, deck: 8 },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const action = game.findCardInstanceId(thisIsBusiness, "hand", PLAYER_TWO)!;
    const item = game.findCardInstanceId(opponentHandItem, "hand", PLAYER_ONE)!;
    const own = game.findCardInstanceId(deckFiller, "hand", PLAYER_TWO)!;
    const beforeDeck = game.asPlayerTwo().getZonesCardCount().deck;
    expect(
      game.asPlayerTwo().playCard(action, { targets: [PLAYER_ONE], inkDrops: 3 }),
    ).toBeSuccessfulCommand();
    for (const invalid of [-1, 2, 99]) {
      expect(game.asPlayerOne().respondWithChoice(invalid)).not.toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
      expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
      expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(beforeDeck);
      expect(game.asPlayerOne().getCardZone(item)).toBe("hand");
    }
    expect(game.asPlayerOne().respondWithChoice(mode)).toBeSuccessfulCommand();
    if (!mode) {
      expect(game.asPlayerTwo().respondWith(own)).not.toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
      expect(game.asPlayerTwo().respondWith(item)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(item)).toBe("discard");
      expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(beforeDeck);
    } else {
      expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(beforeDeck - 1);
      expect(game.asPlayerOne().getCardZone(item)).toBe("hand");
    }
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(mode ? 4 : 6);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(mode ? 2 : 0);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(mode ? 4 : 6);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(mode ? 2 : 0);
    if (mode) {
      expect(game.asPlayerTwo().playCard(own, { inkDrops: 1 })).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
      expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    }
  });
}
