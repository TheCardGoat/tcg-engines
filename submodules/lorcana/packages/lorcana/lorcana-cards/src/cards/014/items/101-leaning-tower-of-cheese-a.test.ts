// CR 2.2.0: 1.3.3, 6.1.4, 6.4.1, 6.7.2, 8.15.1–8.15.2.
// Rules grounding: Leaning Tower of Cheese-a (set14-101).
// FAIR TRADE — When you play this item, you may draw a card, then choose and
// discard a card. EXTRA CHEESY — While you have 4 items named Leaning Tower of
// Cheese-a in play, your items gain Ward.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockLocation,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { iFindEmIFlattenEm } from "../../004/actions/196-i-find-em-i-flatten-em";
import { breakCard } from "../../001/actions/196-break";
import { leaningTowerOfCheesea } from "./101-leaning-tower-of-cheese-a";

const deckCard = createMockCharacter({
  id: "cheese-deck-card",
  name: "Cheese Deck Card",
  cost: 2,
});

const handCard = createMockCharacter({
  id: "cheese-hand-card",
  name: "Cheese Hand Card",
  cost: 2,
});

function cheeseTower(id: string) {
  return createMockItem({
    id,
    name: "Leaning Tower of Cheese-a",
    cost: 1,
  });
}

describe("Leaning Tower of Cheese-a", () => {
  it("player two controls their trade and fourth-copy Ward protects only their items", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [leaningTowerOfCheesea], deck: 6 },
      {
        hand: [leaningTowerOfCheesea, handCard],
        play: [leaningTowerOfCheesea, leaningTowerOfCheesea, leaningTowerOfCheesea],
        deck: [deckCard, handCard],
        inkDrops: 1,
      },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const fourth = game.findCardInstanceId(leaningTowerOfCheesea, "hand", PLAYER_TWO);
    const drawn = game.findCardInstanceId(deckCard, "deck", PLAYER_TWO);
    const enemy = game.findCardInstanceId(leaningTowerOfCheesea, "play", PLAYER_ONE);
    expect(game.asPlayerTwo().playCard(fourth, { inkDrops: 1 })).toBeSuccessfulCommand();
    expect(game.asPlayerTwo()).toHaveKeyword({ card: fourth, keyword: "Ward" });
    expect(game.asPlayerOne()).not.toHaveKeyword({ card: enemy, keyword: "Ward" });
    expect(
      game.asPlayerOne().resolvePendingByCard(fourth, { resolveOptional: true }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(fourth, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(drawn)).toBe("hand");
    expect(game.asPlayerOne().respondWith(drawn)).not.toBeSuccessfulCommand();
    expect(game.asPlayerTwo().respondWith(drawn)).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(drawn)).toBe("discard");
    expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  });
  it("FAIR TRADE — you may draw a card, then choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [leaningTowerOfCheesea, handCard],
      deck: [deckCard],
      inkwell: leaningTowerOfCheesea.cost,
    });

    expect(testEngine.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, {
        resolveOptional: true,
        targets: [handCard],
      }),
    ).toBeSuccessfulCommand();

    // Drew deckCard, discarded handCard → only deckCard remains in hand.
    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("FAIR TRADE — declining draws nothing and discards nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [leaningTowerOfCheesea, handCard],
      deck: [deckCard],
      inkwell: leaningTowerOfCheesea.cost,
    });

    expect(testEngine.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(handCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("EXTRA CHEESY — with 4 copies in play your items gain Ward", () => {
    const otherItem = createMockItem({
      id: "cheese-other-item",
      name: "Some Other Item",
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        leaningTowerOfCheesea,
        cheeseTower("cheese-tower-2"),
        cheeseTower("cheese-tower-3"),
        cheeseTower("cheese-tower-4"),
        otherItem,
      ],
    });

    // All of your items (including the non-Cheese-a one) gain Ward while the
    // fourth copy is in play.
    for (const item of [
      leaningTowerOfCheesea,
      "cheese-tower-2",
      "cheese-tower-3",
      "cheese-tower-4",
      otherItem,
    ] as const) {
      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: testEngine.findCardInstanceId(item, "play", PLAYER_ONE),
        keyword: "Ward",
      });
    }
  });

  it("EXTRA CHEESY — with only 3 copies your items do not gain Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [leaningTowerOfCheesea, cheeseTower("cheese-tower-2"), cheeseTower("cheese-tower-3")],
    });

    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: leaningTowerOfCheesea,
      keyword: "Ward",
    });
  });

  it("EXTRA CHEESY — items with a different name do not count toward the 4", () => {
    const otherItem = createMockItem({
      id: "cheese-other-item-b",
      name: "Some Other Item",
      cost: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        leaningTowerOfCheesea,
        cheeseTower("cheese-tower-2b"),
        cheeseTower("cheese-tower-3b"),
        otherItem,
      ],
    });

    // 3 Cheese-a + 1 other item: the Ward condition is not met.
    expect(testEngine.asPlayerOne()).not.toHaveKeyword({
      card: leaningTowerOfCheesea,
      keyword: "Ward",
    });
  });
});

const filler = createMockCharacter({ id: "cheese-bottom", name: "Bottom", cost: 1 });
const other = createMockItem({ id: "cheese-extra", name: "Other Item", cost: 1 });
const location = createMockLocation({ id: "cheese-location", name: "Location", cost: 1 });

it("draws before the mandatory discard and can discard the newly drawn card", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [leaningTowerOfCheesea, handCard], inkwell: 1, deck: [filler, deckCard] },
    { hand: [handCard], deck: 6 },
  );
  const ownHand = game.findCardInstanceId(handCard, "hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();
  expect(
    game.asPlayerTwo().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: true }),
  ).not.toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckCard)).toBe("hand");
  expect(game.asPlayerOne().getCardZone(filler)).toBe("deck");
  const selection = game.asPlayerOne().getBoard().pendingEffects[0]?.selectionContext;
  expect(selection).toMatchObject({
    kind: "discard-choice",
    chooserId: PLAYER_ONE,
    minSelections: 1,
    maxSelections: 1,
  });
  expect(
    selection && "originatesFromOptional" in selection
      ? selection.originatesFromOptional
      : undefined,
  ).not.toBe(true);
  expect(
    game.asPlayerOne().resolveNextPending({ resolveOptional: false }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(deckCard)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckCard)).toBe("discard");
  expect(game.asPlayerOne().getCardZone(ownHand)).toBe("hand");
});

it("rejects wrong-owner, zone and multiple discards without drawing again", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [leaningTowerOfCheesea, handCard],
      inkwell: 1,
      play: [other],
      discard: [filler],
      deck: [filler, deckCard],
    },
    { hand: [handCard], deck: 6 },
  );
  const own = game.findCardInstanceId(handCard, "hand", PLAYER_ONE);
  const enemy = game.findCardInstanceId(handCard, "hand", PLAYER_TWO);
  const bottom = game.findCardInstanceId(filler, "deck", PLAYER_ONE);
  const discarded = game.findCardInstanceId(filler, "discard", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  for (const targets of [[enemy], [other], [bottom], [discarded], [own, deckCard], []]) {
    expect(game.asPlayerOne().resolveNextPending({ targets })).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(bottom)).toBe("deck");
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(1);
  }
  expect(game.asPlayerOne().respondWith(own)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(own)).toBe("discard");
  expect(game.asPlayerTwo().getCardZone(enemy)).toBe("hand");
});

it("declines even with an empty hand without drawing or creating a discard prompt", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [leaningTowerOfCheesea], inkwell: 1, deck: [filler, deckCard] },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(deckCard)).toBe("deck");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
});

it("still discards an existing card if the optional draw finds an empty deck", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [leaningTowerOfCheesea, handCard], inkwell: 1, deck: [] },
    { deck: 6 },
  );
  expect(game.asPlayerOne().playCard(leaningTowerOfCheesea)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(handCard)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(handCard)).toBe("discard");
  expect(game.asServer().getWinner()).toBeUndefined();
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
});

it("keeps independent copies' accepted and declined trades separate", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture({
    hand: [leaningTowerOfCheesea, leaningTowerOfCheesea],
    inkwell: 2,
    deck: [filler, deckCard],
  });
  const copies = game.getCardInstanceIdsInZone("hand", PLAYER_ONE);
  expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[0]!, { resolveOptional: true }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().respondWith(deckCard)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(copies[1]!, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(filler)).toBe("deck");
  expect(game.asPlayerOne().getZonesCardCount().hand).toBe(0);
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
});

it("protects every own item, excludes other types and controllers, and blocks opponent Break", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        other,
        handCard,
        location,
      ],
      deck: 6,
    },
    { hand: [breakCard], inkwell: 2, play: [other], deck: 6 },
  );
  const own = game.findCardInstanceId(other, "play", PLAYER_ONE);
  const enemy = game.findCardInstanceId(other, "play", PLAYER_TWO);
  expect(game.asPlayerOne()).toHaveKeyword({ card: own, keyword: "Ward" });
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: handCard, keyword: "Ward" });
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: location, keyword: "Ward" });
  expect(game.asPlayerTwo()).not.toHaveKeyword({ card: enemy, keyword: "Ward" });
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(breakCard, { targets: [own] })).not.toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(2);
  expect(game.asPlayerOne().getCardZone(own)).toBe("play");
  expect(game.asPlayerTwo().playCard(breakCard, { targets: [enemy] })).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().getCardZone(enemy)).toBe("discard");
});

it("fourth real copy turns protection on, and own banishment turns it off immediately", () => {
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      hand: [leaningTowerOfCheesea, breakCard],
      inkwell: 3,
      play: [leaningTowerOfCheesea, leaningTowerOfCheesea, leaningTowerOfCheesea, other],
      deck: 6,
    },
    { hand: [breakCard], inkwell: 2, deck: 6 },
  );
  const fourth = game.findCardInstanceId(leaningTowerOfCheesea, "hand", PLAYER_ONE);
  const ownBreak = game.findCardInstanceId(breakCard, "hand", PLAYER_ONE);
  const enemyBreak = game.findCardInstanceId(breakCard, "hand", PLAYER_TWO);
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: other, keyword: "Ward" });
  expect(game.asPlayerOne().playCard(fourth)).toBeSuccessfulCommand();
  expect(
    game.asPlayerOne().resolvePendingByCard(fourth, { resolveOptional: false }),
  ).toBeSuccessfulCommand();
  expect(game.asPlayerOne()).toHaveKeyword({ card: other, keyword: "Ward" });
  expect(game.asPlayerOne().playCard(ownBreak, { targets: [fourth] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(fourth)).toBe("discard");
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: other, keyword: "Ward" });
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(enemyBreak, { targets: [other] })).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getCardZone(other)).toBe("discard");
});

it("does not count matching names outside own item play zone", () => {
  const namedCharacter = createMockCharacter({
    id: "cheese-wrong-type",
    name: "Leaning Tower of Cheese-a",
    cost: 1,
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        leaningTowerOfCheesea,
        cheeseTower("cheese-scope-2"),
        cheeseTower("cheese-scope-3"),
        namedCharacter,
        other,
      ],
      hand: [leaningTowerOfCheesea],
      discard: [leaningTowerOfCheesea],
      deck: [filler, leaningTowerOfCheesea],
    },
    { play: [leaningTowerOfCheesea], deck: 6 },
  );
  expect(game.asPlayerOne()).not.toHaveKeyword({ card: other, keyword: "Ward" });
});

it("keeps protection at five copies and ignores non-chosen banishment", () => {
  const sweep = createMockAction({
    id: "cheese-sweep",
    name: "Sweep",
    cost: 1,
    abilities: [
      {
        type: "action",
        effect: {
          type: "banish",
          target: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
      },
    ],
  });
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    {
      play: [
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        other,
      ],
      deck: 6,
    },
    { hand: [sweep], inkwell: 1, deck: 6 },
  );
  expect(game.asPlayerOne()).toHaveKeyword({ card: other, keyword: "Ward" });
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(game.asPlayerTwo().playCard(sweep)).toBeSuccessfulCommand();
  expect(game.asPlayerOne().getZonesCardCount().play).toBe(0);
  expect(game.asPlayerOne().getCardZone(other)).toBe("discard");
});

it("requires one ink, supports saved drops and can be inked", () => {
  for (const drops of [0, 1]) {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [leaningTowerOfCheesea],
      inkDrops: drops,
      deck: 6,
    });
    expect(game.asPlayerOne().playCard(leaningTowerOfCheesea)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(leaningTowerOfCheesea)).toBe("hand");
    expect(game.getInkDrops(PLAYER_ONE)).toBe(drops);
    if (drops === 1) {
      expect(
        game.asPlayerOne().playCard(leaningTowerOfCheesea, { inkDrops: 1 }),
      ).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(leaningTowerOfCheesea, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
      expect(game.getInkDrops(PLAYER_ONE)).toBe(0);
    } else {
      expect(game.asPlayerOne().ink(leaningTowerOfCheesea)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(leaningTowerOfCheesea)).toBe("inkwell");
    }
  }
});

it("Player Two trades exact fourth/fifth copies and Ward blocks both opponents but not all-item banishment", () => {
  const third = "player_three";
  const game = LorcanaMultiplayerTestEngine.createWithFixture(
    { hand: [breakCard], play: [other], inkwell: 2, deck: 8 },
    {
      hand: [leaningTowerOfCheesea, leaningTowerOfCheesea, breakCard, handCard],
      play: [
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        leaningTowerOfCheesea,
        other,
        handCard,
        location,
      ],
      discard: [leaningTowerOfCheesea],
      inkwell: 2,
      inkDrops: 2,
      deck: 8,
    },
    {
      additionalPlayers: {
        [third]: { hand: [breakCard, iFindEmIFlattenEm], play: [other], inkwell: 6, deck: 8 },
      },
    },
  );
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  const p2 = game.asPlayerTwo();
  const p3 = game.asLorcanaPlayer(third);
  const copies = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .filter((id) => p2.getCardDefinitionByInstanceId(id).id === leaningTowerOfCheesea.id);
  const fourth = copies[0]!;
  const fifth = copies[1]!;
  const ownItem = game.findCardInstanceId(other, "play", PLAYER_TWO)!;
  const characterId = game.findCardInstanceId(handCard, "play", PLAYER_TWO)!;
  const locationId = game.findCardInstanceId(location, "play", PLAYER_TWO)!;
  expect(p2.playCard(fourth, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  expect(p2).toHaveKeyword({ card: ownItem, keyword: "Ward" });
  expect(p2).not.toHaveKeyword({ card: characterId, keyword: "Ward" });
  expect(p2).not.toHaveKeyword({ card: locationId, keyword: "Ward" });
  expect(p3.resolvePendingByCard(fourth, { resolveOptional: true })).not.toBeSuccessfulCommand();
  const handBefore = new Set(game.getCardInstanceIdsInZone("hand", PLAYER_TWO));
  const deckBefore = p2.getZonesCardCount().deck;
  expect(p2.resolvePendingByCard(fourth, { resolveOptional: true })).toBeSuccessfulCommand();
  const newlyDrawn = game
    .getCardInstanceIdsInZone("hand", PLAYER_TWO)
    .find((id) => !handBefore.has(id))!;
  expect(p2.getZonesCardCount().deck).toBe(deckBefore - 1);
  for (const targets of [[], [ownItem], [newlyDrawn, fifth]]) {
    expect(p2.resolveNextPending({ targets })).not.toBeSuccessfulCommand();
    expect(p2.getZonesCardCount().deck).toBe(deckBefore - 1);
    expect(game.getInkDrops(PLAYER_TWO)).toBe(1);
  }
  expect(p3.respondWith(newlyDrawn)).not.toBeSuccessfulCommand();
  expect(p2.respondWith(newlyDrawn)).toBeSuccessfulCommand();
  expect(p2.getCardZone(newlyDrawn)).toBe("discard");
  expect(p2.playCard(fifth, { inkDrops: 1 })).toBeSuccessfulCommand();
  expect(p2.resolvePendingByCard(fifth, { resolveOptional: false })).toBeSuccessfulCommand();
  expect(p2.getZonesCardCount().deck).toBe(deckBefore - 1);
  expect(game.getInkDrops(PLAYER_TWO)).toBe(0);
  expect(p2).toHaveKeyword({ card: fifth, keyword: "Ward" });
  expect(p2).toHaveKeyword({ card: ownItem, keyword: "Ward" });
  expect(
    p2.playCard(game.findCardInstanceId(breakCard, "hand", PLAYER_TWO)!, { targets: [fifth] }),
  ).toBeSuccessfulCommand();
  expect(p2.getCardZone(fifth)).toBe("discard");
  expect(p2).toHaveKeyword({ card: ownItem, keyword: "Ward" });
  expect(p2.passTurn()).toBeSuccessfulCommand();
  expect(
    p3.playCard(game.findCardInstanceId(breakCard, "hand", third)!, { targets: [ownItem] }),
  ).not.toBeSuccessfulCommand();
  expect(p3.getAvailableInk(third)).toBe(6);
  expect(p3.passTurn()).toBeSuccessfulCommand();
  expect(
    game
      .asPlayerOne()
      .playCard(game.findCardInstanceId(breakCard, "hand", PLAYER_ONE)!, { targets: [ownItem] }),
  ).not.toBeSuccessfulCommand();
  expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(2);
  expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
  expect(p2.passTurn()).toBeSuccessfulCommand();
  expect(
    p3.playCard(game.findCardInstanceId(iFindEmIFlattenEm, "hand", third)!),
  ).toBeSuccessfulCommand();
  expect(p2.getCardZone(ownItem)).toBe("discard");
  expect(p2.getCardZone(fourth)).toBe("discard");
  expect(p2.getCardZone(characterId)).toBe("play");
  expect(p2.getCardZone(locationId)).toBe("play");
  expect(p2.getZonesCardCount().play).toBe(2);
  expect(game.asPlayerOne().getZonesCardCount().play).toBe(0);
  expect(p3.getZonesCardCount().play).toBe(0);
});
