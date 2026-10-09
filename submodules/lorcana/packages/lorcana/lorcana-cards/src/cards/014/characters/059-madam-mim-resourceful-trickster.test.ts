// CR 1.6.1, 4.3.2.4, 4.3.3: payment precedes entry; Bauble Game cannot observe its own play payment.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { khanTransportDelivery } from "../actions/199-khan-transport-delivery";
import { madamMimResourcefulTrickster } from "./059-madam-mim-resourceful-trickster";

const cheapSpell = createMockAction({
  id: "mim-059-cheap-spell",
  name: "Cheap Spell",
  cost: 2,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Gain 1 lore.",
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

const anotherCheapSpell = createMockAction({
  id: "mim-059-another-spell",
  name: "Another Cheap Spell",
  cost: 2,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Gain 1 lore.",
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

const thirdCheapSpell = createMockAction({
  id: "mim-059-third-spell",
  name: "Third Cheap Spell",
  cost: 2,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      text: "Gain 1 lore.",
      effect: {
        type: "gain-lore",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
});

describe("Madam Mim - Resourceful Trickster", () => {
  it("does not draw when played without removing an ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [madamMimResourcefulTrickster, cheapSpell, anotherCheapSpell],
      inkwell: madamMimResourcefulTrickster.cost,
      deck: 4,
    });

    expect(testEngine.asPlayerOne().playCard(madamMimResourcefulTrickster)).toBeSuccessfulCommand();

    // No ink drop was removed: she did not draw, hand is just the two spells.
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
  });

  it("draws 2 cards when an ink drop was removed to play her", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery, madamMimResourcefulTrickster],
      inkwell: madamMimResourcefulTrickster.cost + khanTransportDelivery.cost,
      deck: 5,
    });

    // Khan Transport Delivery (cost 2): "Draw a card. Get 1 ink drop."
    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);

    // Eight ready ink remain; the player chooses to use one drop and seven ink.
    expect(
      testEngine.asPlayerOne().playCard(madamMimResourcefulTrickster, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
    // UPPER HAND draws two. BAUBLE GAME is not active before she enters play.
    testEngine.asPlayerOne().resolveAllBagEffects();
    // Hand: 0 after Khan + Mim play, +1 Khan draw, +2 UPPER HAND.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
  });

  it("an existing Mim observes payment, but the incoming Mim keeps her Bauble Game available", () => {
    const observer = { ...madamMimResourcefulTrickster, id: "mim-existing-observer" };
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [observer],
      hand: [madamMimResourcefulTrickster, cheapSpell],
      inkwell: 12,
      inkDrops: 2,
      deck: 8,
    });
    expect(
      game.asPlayerOne().playCard(madamMimResourcefulTrickster, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    game.asPlayerOne().resolveAllBagEffects();
    // One card stays in hand, plus Upper Hand's two and the observer's one.
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(4);
    expect(game.asPlayerOne().playCard(cheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
    game.asPlayerOne().resolveAllBagEffects();
    // The observer already triggered. Only the newly played Mim draws now.
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(4);
  });

  it("does not count ink drops removed earlier in the turn for other cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery, cheapSpell, madamMimResourcefulTrickster],
      inkwell: 11,
      deck: 5,
    });

    // Khan gains 1 ink drop; Cheap Spell removes it as payment.
    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().playCard(cheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    // Mim is paid with ink only — the earlier removal was for another card,
    // so UPPER HAND ("if you removed an ink drop to play her") must not fire.
    expect(testEngine.asPlayerOne().playCard(madamMimResourcefulTrickster)).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects();

    // Hand: 3 - khan + 1 (khan draw) - spell - mim = 1. No UPPER HAND draw.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("BAUBLE GAME — draws when she removes an ink drop, only once per turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [khanTransportDelivery, cheapSpell, anotherCheapSpell, thirdCheapSpell],
      inkwell: 9,
      deck: 4,
      play: [madamMimResourcefulTrickster],
      // Three banked drops: two same-turn removals plus one after the
      // once-per-turn reset — every claimed payment is actually backed.
      inkDrops: 3,
    });

    // Bank ink drops first, then pay with them twice in the same turn.
    expect(testEngine.asPlayerOne().playCard(khanTransportDelivery)).toBeSuccessfulCommand();

    // Removal #1: paying Cheap Spell with an ink drop triggers BAUBLE GAME's
    // draw. Hand: 4 (after Khan's own draw) - 1 (played) + 1 (BAUBLE GAME
    // draw) = 4.
    expect(testEngine.asPlayerOne().playCard(cheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);

    // Removal #2 in the same turn: once-per-turn blocks the second draw.
    expect(
      testEngine.asPlayerOne().playCard(anotherCheapSpell, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    // Hand: 4 - 1 (played) = 3; once-per-turn blocks the second draw.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);

    // A later turn resets once-per-turn: removing an ink drop again draws
    // again — the third spell stays in hand for exactly this.
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const deckBeforeResetDraw = testEngine.asPlayerOne().getZonesCardCount().deck;
    expect(
      testEngine.asPlayerOne().playCard(thirdCheapSpell, { inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    // Hand: 4 (3 + the turn's draw step) - 1 (played) + 1 (BAUBLE GAME draw
    // after reset) = 4, and the draw consumed a deck card.
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(4);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBeforeResetDraw - 1);
  });
  it("player-two Bauble Game draws once for multiple removed drops and preserves opposing drops", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: 6, inkDrops: 4 },
      {
        play: [madamMimResourcefulTrickster],
        hand: [cheapSpell, anotherCheapSpell],
        deck: 6,
        inkDrops: 3,
        inkwell: 2,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const before = game.asPlayerTwo().getZonesCardCount();
    expect(game.asPlayerTwo().playCard(cheapSpell, { inkDrops: 2 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand);
    expect(game.asPlayerTwo().playCard(anotherCheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 1);
    expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand - 1);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  });
});

it("Player Two's existing Mim sees payment but the incoming Mim keeps Bauble Game unused", () => {
  const observer = { ...madamMimResourcefulTrickster, id: "mim-p2-observer" };
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { deck: 10, inkDrops: 4 },
    {
      play: [observer],
      hand: [madamMimResourcefulTrickster, khanTransportDelivery, cheapSpell],
      inkwell: 12,
      inkDrops: 3,
      deck: 10,
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount();
  expect(
    game.asPlayerTwo().playCard(madamMimResourcefulTrickster, { inkDrops: 3 }),
  ).toBeSuccessfulCommand();
  game.asPlayerTwo().resolveAllBagEffects();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before.deck - 3);
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(before.hand + 2);
  expect(game.asPlayerTwo().playCard(khanTransportDelivery)).toBeSuccessfulCommand();
  const afterKhan = game.asPlayerTwo().getZonesCardCount();
  expect(game.asPlayerTwo().playCard(cheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
  game.asPlayerTwo().resolveAllBagEffects();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(afterKhan.deck - 1);
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(afterKhan.hand);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
});

it("opponent removal does not draw or consume Player Two's once-per-turn use, which resets next own turn", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [cheapSpell], inkDrops: 2, deck: 8 },
    {
      play: [madamMimResourcefulTrickster],
      hand: [cheapSpell, anotherCheapSpell, thirdCheapSpell],
      inkDrops: 3,
      inkwell: 3,
      deck: 8,
    },
  );
  expect(game.asPlayerOne().playCard(cheapSpell, { inkDrops: 2 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(8);
  expect(game.asPlayerTwo().getZonesCardCount().hand).toBe(3);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const before = game.asPlayerTwo().getZonesCardCount().deck;
  expect(game.asPlayerTwo().playCard(cheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
  game.asPlayerTwo().resolveAllBagEffects();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before - 1);
  expect(game.asPlayerTwo().playCard(anotherCheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(before - 1);
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const reset = game.asPlayerTwo().getZonesCardCount().deck;
  expect(game.asPlayerTwo().playCard(thirdCheapSpell, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(reset - 1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
});
