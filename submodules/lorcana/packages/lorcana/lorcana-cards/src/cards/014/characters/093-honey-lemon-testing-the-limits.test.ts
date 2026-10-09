// Rules grounding: Hyperia City ink-drop mechanic — each ink drop may be
// removed to pay 1 {I} of any color; drops persist between turns.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockLocation,
  createMockAction,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { honeyLemonTestingTheLimits } from "./093-honey-lemon-testing-the-limits";

const reagentItem = createMockItem({
  id: "honey-lemon-reagent",
  name: "Chemical Reagent",
  cost: 1,
});

const drawnCard = createMockItem({
  id: "honey-lemon-drawn",
  name: "Drawn Schema",
  cost: 1,
});

describe("Honey Lemon - Testing the Limits", () => {
  it("ADVANCED CHEMISTRY on play may banish your item to draw a card and get 1 ink drop", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [honeyLemonTestingTheLimits],
      play: [reagentItem],
      deck: [drawnCard],
      inkwell: honeyLemonTestingTheLimits.cost,
    });

    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);

    expect(testEngine.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
        resolveOptional: true,
        targets: [reagentItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(reagentItem)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });

  it("ADVANCED CHEMISTRY can be declined on play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [honeyLemonTestingTheLimits],
      play: [reagentItem],
      deck: [drawnCard],
      inkwell: honeyLemonTestingTheLimits.cost,
    });

    expect(testEngine.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(reagentItem)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(0);
  });

  it("ADVANCED CHEMISTRY triggers whenever she quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [honeyLemonTestingTheLimits, reagentItem],
      deck: [drawnCard],
    });
    expect(testEngine.asPlayerOne().quest(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
        resolveOptional: true,
        targets: [reagentItem],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(reagentItem)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.getInkDrops(PLAYER_ONE)).toBe(1);
  });
});
const character = createMockCharacter({ id: "honey-character", name: "Character", cost: 1 });
const location = createMockLocation({ id: "honey-location", name: "Location", cost: 1 });

it("rejects opposing items, wrong card types/zones and multiple items before any reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [honeyLemonTestingTheLimits, reagentItem],
      play: [reagentItem, drawnCard, character, location],
      discard: [reagentItem],
      inkwell: 3,
      deck: 6,
    },
    { play: [reagentItem], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(reagentItem, "play", PLAYER_ONE);
  const other = game.findCardInstanceId(drawnCard, "play", PLAYER_ONE);
  const enemy = game.findCardInstanceId(reagentItem, "play", PLAYER_TWO);
  for (const targets of [
    [enemy],
    [character],
    [location],
    [game.findCardInstanceId(reagentItem, "hand", PLAYER_ONE)],
    [game.findCardInstanceId(reagentItem, "discard", PLAYER_ONE)],
    [own, other],
  ]) {
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: true, targets }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getBagCount()).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(game.asPlayerOne().getCardZone(own)).toBe("play");
    expect(game.asPlayerTwo().getCardZone(enemy)).toBe("play");
  }
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: true, targets: [own] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(5);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().getCardZone(other)).toBe("play");
});
it("accepting with no own item gives neither a draw nor a drop", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [honeyLemonTestingTheLimits], play: [character], inkwell: 3, deck: 6 },
    { play: [reagentItem], deck: 6 },
  );
  expect(game.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount())
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerTwo().getCardZone(reagentItem)).toBe("play");
});
it("declining a quest preserves the item, deck and existing drops", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [honeyLemonTestingTheLimits, reagentItem],
    deck: 6,
    inkDrops: 2,
  });
  expect(game.asPlayerOne().quest(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.getLore(PLAYER_ONE)).toBe(1);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(6);
  expect(game.asPlayerOne().getCardZone(reagentItem)).toBe("play");
});
it("each quest can independently banish another item for another reward", () => {
  const ready = createMockAction({
    id: "honey-ready",
    name: "Ready",
    cost: 1,
    abilities: [{ type: "action", effect: { type: "ready", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [honeyLemonTestingTheLimits, reagentItem, drawnCard],
    hand: [ready],
    inkwell: 1,
    deck: 6,
  });
  for (const [n, item] of [reagentItem, drawnCard].entries()) {
    if (n)
      expect(
        game.asPlayerOne().playCard(ready, { targets: [honeyLemonTestingTheLimits] }),
      ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().quest(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
        resolveOptional: true,
        targets: [item],
      }),
    ).toBeSuccessfulCommand();
    expect(game.getInkDrops(PLAYER_ONE)).toBe(n + 1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(5 - n);
    expect(game.getLore(PLAYER_ONE)).toBe(n + 1);
  }
});
it("copies trigger only for their own play or quest", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    play: [honeyLemonTestingTheLimits, reagentItem, drawnCard],
    hand: [honeyLemonTestingTheLimits],
    inkwell: 3,
    deck: 6,
  });
  const old = game.findCardInstanceId(honeyLemonTestingTheLimits, "play", PLAYER_ONE);
  const next = game.findCardInstanceId(honeyLemonTestingTheLimits, "hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(next)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(1);
  expect(
    game
      .asPlayerOne()
      .resolvePendingByCard(next, { resolveOptional: true, targets: [reagentItem] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().quest(old)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getBagCount()).toBe(1);
  expect(
    game.asPlayerOne().resolvePendingByCard(old, { resolveOptional: true, targets: [drawnCard] }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(4);
});
it("cannot pay for Honey with its future reward", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [honeyLemonTestingTheLimits],
    play: [reagentItem],
    inkwell: 2,
    deck: 6,
  });
  expect(game.asPlayerOne().playCard(honeyLemonTestingTheLimits)).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().getCardZone(reagentItem)).toBe("play");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
});
it("saved drops pay the full play cost and the new drop pays for the drawn item", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [honeyLemonTestingTheLimits],
    play: [reagentItem],
    inkwell: 1,
    inkDrops: 2,
    deck: [drawnCard],
  });
  expect(
    game.asPlayerOne().playCard(honeyLemonTestingTheLimits, { inkDrops: 2 }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
  expect(
    game.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
      resolveOptional: true,
      targets: [reagentItem],
    }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().playCard(drawnCard, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
  expect(game.asPlayerOne().getCardZone(drawnCard)).toBe("play");
});
it("banishes the item and awards the drop with an empty deck, then loses at the turn boundary", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [honeyLemonTestingTheLimits], play: [reagentItem], inkwell: 3, deck: [] },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
      resolveOptional: true,
      targets: [reagentItem],
    }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(reagentItem)).toBe("discard");
  expect(game.getInkDrops(PLAYER_ONE)).toBe(1);
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().hasGameEnded()).toBe(false);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerOne().hasGameEnded()).toBe(true);
  expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
});
it("the reward adds to existing drops and persists across turns", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [honeyLemonTestingTheLimits], play: [reagentItem], inkwell: 3, inkDrops: 2, deck: 6 },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(honeyLemonTestingTheLimits, {
      resolveOptional: true,
      targets: [reagentItem],
    }),
  ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().quest(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  if (game.asPlayerOne().getBagCount())
    expect(
      game
        .asPlayerOne()
        .resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_ONE)).toBe(3);
  expect(game.asPlayerOne().getZonesCardCount().deck).toBe(4);
});

it("player two banishes only their item and keeps the draw private", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { play: [reagentItem], inkDrops: 4, deck: 6 },
    {
      hand: [honeyLemonTestingTheLimits],
      play: [reagentItem],
      inkwell: 3,
      inkDrops: 2,
      deck: [drawnCard, character],
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const own = game.findCardInstanceId(reagentItem, "play", PLAYER_TWO);
  const other = game.findCardInstanceId(reagentItem, "play", PLAYER_ONE);
  const drawn = game.findCardInstanceId(drawnCard, "deck", PLAYER_TWO);
  expect(game.asPlayerTwo().playCard(honeyLemonTestingTheLimits)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(honeyLemonTestingTheLimits, {
      resolveOptional: true,
      targets: [other],
    }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getBagCount()).toBe(1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(2);
  expect(
    game
      .asPlayerTwo()
      .resolvePendingByCard(honeyLemonTestingTheLimits, { resolveOptional: true, targets: [own] }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(own)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(other)).toBe("play");
  expect(game.asPlayerTwo().getCardZone(drawn)).toBe("hand");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
  const log = JSON.stringify(
    game
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public),
  );
  expect(log).toContain(own);
  expect(log).not.toContain(drawn);
});

it("Player Two repeated quest rewards survive source removal and pay a later cost", () => {
  const removal = createMockAction({
    id: "honey-removal",
    name: "Removal",
    cost: 1,
    abilities: [{ type: "action", effect: { type: "banish", target: "CHOSEN_CHARACTER" } }],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [removal], play: [reagentItem], inkwell: 1, inkDrops: 4, deck: 10 },
    {
      hand: [drawnCard],
      play: [honeyLemonTestingTheLimits, reagentItem, drawnCard],
      inkDrops: 2,
      deck: 10,
    },
  );
  const honey = game.findCardInstanceId(honeyLemonTestingTheLimits, "play", PLAYER_TWO)!;
  const enemy = game.findCardInstanceId(reagentItem, "play", PLAYER_ONE)!;
  const items = [reagentItem, drawnCard].map(
    (card) => game.findCardInstanceId(card, "play", PLAYER_TWO)!,
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  for (const [n, item] of items.entries()) {
    const deckBefore = game.asPlayerTwo().getZonesCardCount().deck;
    expect(game.asPlayerTwo().quest(honey)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(honey, { resolveOptional: true, targets: [item] }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(honey, { resolveOptional: true, targets: [enemy] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getBagCount()).toBe(1);
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(deckBefore);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(2 + n);
    expect(game.asPlayerTwo().getCardZone(item)).toBe("play");
    expect(
      game.asPlayerTwo().resolvePendingByCard(honey, { resolveOptional: true, targets: [item] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getZonesCardCount().deck).toBe(deckBefore - 1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(3 + n);
    expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    if (!n) expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  }
  expect(game.asPlayerOne().playCard(removal, { targets: [honey] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(honey)).toBe("discard");
  expect(game.getInkDrops(PLAYER_TWO)).toBe(4);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const payment = game.findCardInstanceId(drawnCard, "hand", PLAYER_TWO)!;
  expect(game.asPlayerTwo().playCard(payment, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(3);
  expect(game.getInkDrops(PLAYER_ONE)).toBe(4);
});
