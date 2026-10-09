// CR 1.2.3, 6.1.3, 6.1.5.1, 6.7.2.4: resolve in order, caster chooses optional
// item and opponent; discard is conditional on banishment and chosen by that opponent.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockLocation,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { chemicalReaction } from "./099-chemical-reaction";

const deckFiller = createMockCharacter({ id: "chem-deck", name: "Deck Filler", cost: 1 });
const myItem = createMockItem({ id: "chem-item", name: "Volatile Item", cost: 2 });
const opponentHandCard = createMockCharacter({
  id: "chem-hand",
  name: "Hand Filler",
  cost: 2,
});

describe("Chemical Reaction", () => {
  it("draws a card; declining the banish skips the opponent discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chemicalReaction],
        inkwell: chemicalReaction.cost,
        deck: [deckFiller],
        play: [myItem],
      },
      {
        hand: [opponentHandCard],
      },
    );

    expect(testEngine.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chemicalReaction, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(testEngine.asPlayerOne().getCardZone(myItem)).toBe("play");
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
  });

  it("banishing your item makes the chosen opponent discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chemicalReaction],
        inkwell: chemicalReaction.cost,
        deck: [deckFiller],
        play: [myItem],
      },
      {
        hand: [opponentHandCard],
      },
    );

    expect(testEngine.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(chemicalReaction, {
        resolveOptional: true,
        targets: [myItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
    // The selected opponent chooses which card to discard.
    expect(testEngine.asPlayerTwo().respondWith(opponentHandCard)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(myItem)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
  });
});
it("lets the caster choose an opponent after banishment, then only that opponent chooses discard", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [deckFiller], play: [myItem] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("hand");
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(chemicalReaction, { resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_ONE)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(opponentHandCard)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(opponentHandCard)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
});
const otherHand = createMockCharacter({ id: "chem-other-hand", name: "Other Hand", cost: 1 });
const bottom = createMockCharacter({ id: "chem-bottom", name: "Bottom", cost: 1 });
const enemyItem = createMockItem({ id: "chem-enemy-item", name: "Enemy Item", cost: 1 });
const location = createMockLocation({ id: "chem-location", name: "Location", cost: 1 });
it("player two draws privately, banishes only their item, and lets player one choose the discard", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [opponentHandCard, otherHand], play: [myItem], deck: 6 },
    { hand: [chemicalReaction], play: [myItem], deck: [bottom, deckFiller, bottom], inkDrops: 2 },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const ownItem = game.findCardInstanceId(myItem, "play", PLAYER_TWO);
  const opposingItem = game.findCardInstanceId(myItem, "play", PLAYER_ONE);
  const drawn = game.findCardInstanceId(deckFiller, "deck", PLAYER_TWO);
  const discarded = game.findCardInstanceId(opponentHandCard, "hand", PLAYER_ONE);
  expect(game.asPlayerTwo().playCard(chemicalReaction, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(drawn)).toBe("hand");
  expect(
    game.asPlayerTwo().resolveNextPending({ resolveOptional: true, targets: [opposingItem] }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolveNextPending({ resolveOptional: true, targets: [ownItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(PLAYER_TWO)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(PLAYER_ONE)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(discarded)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(discarded)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(discarded)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(opposingItem)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(ownItem)).toBe("discard");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  const publicLog = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(publicLog).not.toContain(drawn);
  expect(publicLog).toContain(ownItem);
  expect(publicLog).toContain(discarded);
});
it("draws exactly the top card before asking whether to banish; opponent cannot decline for caster", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [bottom, deckFiller], play: [myItem] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("hand");
  expect(game.asPlayerOne().getCardZone(bottom)).toBe("deck");
  expect(
    game.asPlayerTwo().resolveNextPending({ resolveOptional: false }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("rejects wrong owner/type/zone and multiple banish targets; accepts valid retry without redrawing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [chemicalReaction, enemyItem],
      inkwell: 2,
      deck: [bottom, deckFiller],
      play: [myItem, location, otherHand],
      discard: [opponentHandCard],
    },
    { play: [enemyItem], hand: [opponentHandCard] },
  );
  const enemy = game.findCardInstanceId(enemyItem, "play", PLAYER_TWO);
  const handItem = game.findCardInstanceId(enemyItem, "hand", PLAYER_ONE);
  const discarded = game.findCardInstanceId(opponentHandCard, "discard", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  for (const targets of [
    [enemy],
    [handItem],
    [discarded],
    [otherHand],
    [location],
    [myItem, location],
  ]) {
    expect(
      game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(myItem)).toBe("play");
    expect(game.asPlayerOne().getCardZone(bottom)).toBe("deck");
  }
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(opponentHandCard)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("hand");
});
it("rejects self/multiple opponents and wrong discard choices without skipping the required discard", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [deckFiller], play: [myItem] },
    { hand: [opponentHandCard, otherHand], play: [enemyItem] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  for (const targets of [[PLAYER_ONE], [PLAYER_ONE, PLAYER_TWO]])
    expect(game.asPlayerOne().resolveNextPending({ targets })).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  const prompt = game.asPlayerTwo().getBoard().pendingEffects[0]?.selectionContext;
  expect(prompt).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_TWO,
    minSelections: 1,
    maxSelections: 1,
  });
  expect(
    prompt && "originatesFromOptional" in prompt ? prompt.originatesFromOptional : undefined,
  ).not.toBe(true);
  expect(game.asPlayerTwo().resolveNextPending({ targets: [] })).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(deckFiller)).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(enemyItem)).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolveNextPending({ targets: [opponentHandCard, otherHand] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(otherHand)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(otherHand)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
});
it("finishes after banishment when the chosen opponent has an empty hand", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [bottom, deckFiller], play: [myItem] },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("discard");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});
it("does not discard merely because the initial draw succeeded when no item is banished", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [bottom, deckFiller] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});
it("requires two ink before drawing or banishing", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 1, deck: [deckFiller], play: [myItem] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("deck");
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("play");
  expect(game.asPlayerOne().getCardZone(chemicalReaction)).toBe("hand");
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(1);
});
it("spends two saved drops and still draws when declining the optional banish", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkDrops: 3, deck: [deckFiller], play: [myItem] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().getCardZone(deckFiller)).toBe("hand");
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("play");
});
it("keeps consecutive copy choices independent", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [chemicalReaction, chemicalReaction],
      inkwell: 4,
      deck: [bottom, deckFiller],
      play: [myItem],
    },
    { hand: [opponentHandCard, otherHand] },
  );
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(2);
  expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(bottom)).toBe("hand");
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(opponentHandCard)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(1);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});
it("continues the optional/discard effect after an empty-deck draw, then loses at turn boundary", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [], play: [myItem] },
    { hand: [opponentHandCard], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [myItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(PLAYER_TWO)).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().respondWith(opponentHandCard)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(myItem)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("discard");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
});
it("is inkable", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [chemicalReaction] });
  expect(game.asPlayerOne().ink(chemicalReaction)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(chemicalReaction)).toBe("inkwell");
});
it("accepting with no item to banish does not reuse the draw as an if-you-do success", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [chemicalReaction], inkwell: 2, deck: [bottom, deckFiller] },
    { hand: [opponentHandCard] },
  );
  expect(game.asPlayerOne().playCard(chemicalReaction)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: true, targets: [] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(opponentHandCard)).toBe("hand");
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});

it("three-player Player Two resolves three exact copies with independent choices and private discards", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [opponentHandCard, otherHand], play: [myItem], deck: 8 },
    {
      hand: [chemicalReaction, chemicalReaction, chemicalReaction],
      play: [myItem, enemyItem],
      inkDrops: 6,
      deck: 8,
    },
    {
      additionalPlayers: {
        player_three: { hand: [opponentHandCard, otherHand], play: [myItem], deck: 8 },
      },
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const client = game.asPlayerTwo();
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_TWO).slice(0, 3);
  const originalDeck = client.getZonesCardCount().deck;
  expect(client.playCard(copies[0]!, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(client.resolveNextPending({ resolveOptional: false })).toBeSuccessfulCommand();
  expect(client.getZonesCardCount().deck).toBe(originalDeck - 1);
  for (const [index, opponent] of ["player_three", PLAYER_ONE].entries()) {
    const beforeHand = game.asLorcanaPlayer(opponent).getZonesCardCount().hand;
    const nonchosen = opponent === PLAYER_ONE ? "player_three" : PLAYER_ONE;
    const nonchosenHand = game.asLorcanaPlayer(nonchosen).getZonesCardCount().hand;
    const item = game.findCardInstanceId(index ? enemyItem : myItem, "play", PLAYER_TWO)!;
    const opposingItem = game.findCardInstanceId(myItem, "play", opponent)!;
    expect(client.playCard(copies[index + 1]!, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(
      client.resolveNextPending({ resolveOptional: true, targets: [opposingItem] }),
    ).not.toBeSuccessfulCommand();
    expect(client.getZonesCardCount().deck).toBe(originalDeck - index - 2);
    expect(
      client.resolveNextPending({ resolveOptional: true, targets: [item] }),
    ).toBeSuccessfulCommand();
    expect(client.respondWith(PLAYER_TWO)).not.toBeSuccessfulCommand();
    expect(client.respondWith(opponent)).toBeSuccessfulCommand();
    expect(
      game.asLorcanaPlayer(nonchosen).resolveNextPending({ targets: [] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asLorcanaPlayer(opponent).resolveNextPending({ targets: [] }),
    ).not.toBeSuccessfulCommand();
    const discarded = game.findCardInstanceId(otherHand, "hand", opponent)!;
    expect(game.asLorcanaPlayer(opponent).respondWith(discarded)).toBeSuccessfulCommand();
    expect(game.asLorcanaPlayer(opponent).getZonesCardCount().hand).toBe(beforeHand - 1);
    expect(game.asLorcanaPlayer(nonchosen).getZonesCardCount().hand).toBe(nonchosenHand);
    expect(client.getCardZone(item)).toBe("discard");
    expect(game.asLorcanaPlayer(opponent).getCardZone(opposingItem)).toBe("play");
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2 - index * 2);
  }
  expect(client.getBagCount()).toBe(0);
  expect(client.getZonesCardCount().deck).toBe(originalDeck - 3);
  expect(client.getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(client.passTurn()).toBeSuccessfulCommand();
});
