// Rules grounding: Upgraded Chem Purse (set14-169).
// IT'S GOT POCKETS! {E}, 1 {I}, Banish one of your other items — Look at the
// top 4 cards of your deck. You may reveal an item card and put it into your
// hand. Put the rest on the bottom of your deck in any order.
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { upgradedChemPurse } from "./169-upgraded-chem-purse";

const otherItem = createMockItem({
  id: "purse-other-item",
  name: "Purse Other Item",
  cost: 1,
});

const itemOnTop = createMockItem({
  id: "purse-top-item",
  name: "Purse Top Item",
  cost: 2,
});

function filler(id: string) {
  return createMockCharacter({ id, name: `Purse Filler ${id}`, cost: 1 });
}

describe("Upgraded Chem Purse", () => {
  it("rejects an item below the four looked-at cards and allows a paid-choice retry", () => {
    const unseen = createMockItem({ id: "purse-unseen-item", name: "Unseen Item", cost: 1 });
    const first = filler("looked-first");
    const second = filler("looked-second");
    const third = filler("looked-third");
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [unseen, first, second, third, itemOnTop],
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [unseen] },
          { zone: "deck-bottom", cards: [third, second, first] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("discard");
    expect(g.isExerted(upgradedChemPurse)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [third, second, first] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      first.id,
      second.id,
      third.id,
      unseen.id,
    ]);
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("an exerted Purse cannot activate or charge its other-item cost", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: upgradedChemPurse, exerted: true }, otherItem],
      inkwell: 1,
      deck: [itemOnTop],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([itemOnTop.id]);
  });

  it("takes only one exact duplicate item from the looked-at cards", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [itemOnTop, itemOnTop],
    });
    const [selected, remaining] = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [selected!, remaining!] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [selected!] },
          { zone: "deck-bottom", cards: [remaining!] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([selected!]);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual([remaining!]);
  });

  it("normal play does not banish an item or look at the deck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [upgradedChemPurse],
      play: [otherItem],
      inkwell: 2,
      deck: [itemOnTop],
    });
    expect(g.asPlayerOne().playCard(upgradedChemPurse)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([itemOnTop.id]);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });

  it("normal inking does not activate the Purse", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [upgradedChemPurse],
      play: [otherItem],
      deck: [itemOnTop],
    });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, upgradedChemPurse)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([itemOnTop.id]);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("an empty deck still pays all costs and leaves no pending choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("discard");
    expect(g.isExerted(upgradedChemPurse)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
  });

  it("a deck with no item can put all cards on the bottom", () => {
    const first = filler("noitem-first");
    const second = filler("noitem-second");
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [first, second],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [first, second] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([second.id, first.id]);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
  });

  it("player two pays its own cost and chooses only its own deck", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [itemOnTop, otherItem], inkwell: 2 },
      { play: [upgradedChemPurse, otherItem], deck: [itemOnTop, itemOnTop], inkwell: 2 },
    );
    const opponentDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const [selected] = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    const cost = g.findCardInstanceId(otherItem, "play", PLAYER_TWO);
    expect(
      g.asPlayerTwo().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [cost] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [selected!] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [selected!] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(selected!);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(opponentDeck);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(1);
  });

  it("rejects a nonitem hand destination and allows a valid retry", () => {
    const nonitem = filler("illegal-hand");
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [nonitem, itemOnTop],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [nonitem] },
          { zone: "deck-bottom", cards: [itemOnTop] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(nonitem)).toBe("deck");
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("deck");
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [nonitem] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([nonitem.id]);
  });

  it("a one-card deck can reveal its only item", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [itemOnTop],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("discard");
  });

  it("preserves untouched cards above the chosen bottom order", () => {
    const untouchedA = filler("untouched-a");
    const untouchedB = filler("untouched-b");
    const first = filler("order-first");
    const second = filler("order-second");
    const third = filler("order-third");
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 1,
      deck: [untouchedA, untouchedB, first, second, third, itemOnTop],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [second, first, third] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      third.id,
      first.id,
      second.id,
      untouchedA.id,
      untouchedB.id,
    ]);
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
  });

  it("rejects opposing and nonitem cost selections before any payment", () => {
    const character = filler("cost-character");
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [upgradedChemPurse, otherItem, character], inkwell: 2, deck: [itemOnTop] },
      { play: [itemOnTop] },
    );
    for (const card of [itemOnTop, character]) {
      expect(
        g.asPlayerOne().activateAbility(upgradedChemPurse, {
          ability: "IT'S GOT POCKETS!",
          costs: { banishItems: [card] },
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(g.isExerted(upgradedChemPurse)).toBe(false);
      expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    }
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("discard");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
  });

  it("requires a cost choice when two other items are eligible", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem, itemOnTop],
      inkwell: 2,
      deck: [filler("missing-cost")],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, { ability: "IT'S GOT POCKETS!" }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.isExerted(upgradedChemPurse)).toBe(false);
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("play");
  });

  it("pays a chosen item as a cost before opening the deck choice", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem, itemOnTop],
      inkwell: 2,
      deck: [filler("cost-deck")],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.isExerted(upgradedChemPurse)).toBe(true);
  });

  it("rejects using the Purse itself as the other-item cost without payment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      inkwell: 2,
      deck: [itemOnTop],
    });
    expect(
      g.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [upgradedChemPurse] },
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
    expect(g.isExerted(upgradedChemPurse)).toBe(false);
    expect(g.asPlayerOne().getCardZone(otherItem)).toBe("play");
    expect(g.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("banishes another item, lets you take an item from the top 4, and puts the rest on the bottom", () => {
    const nonItemA = filler("top-a");
    const nonItemB = filler("top-b");
    const nonItemC = filler("top-c");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [upgradedChemPurse, otherItem],
      deck: [itemOnTop, nonItemA, nonItemB, nonItemC],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();

    // The chosen other item is banished as part of the ability.
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("discard");

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [nonItemC, nonItemB, nonItemA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
    // Purse itself stays in play.
    expect(testEngine.asPlayerOne().getCardZone(upgradedChemPurse)).toBe("play");
  });

  it("declining the item puts all 4 cards on the bottom", () => {
    const nonItemA = filler("decline-a");
    const nonItemB = filler("decline-b");
    const nonItemC = filler("decline-c");

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [upgradedChemPurse, otherItem],
      deck: [nonItemA, nonItemB, nonItemC, itemOnTop],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(upgradedChemPurse, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [otherItem] },
      }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(upgradedChemPurse, {
        destinations: [
          { zone: "hand", cards: [] },
          { zone: "deck-bottom", cards: [itemOnTop, nonItemC, nonItemB, nonItemA] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(itemOnTop)).not.toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(4);
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      nonItemA.id,
      nonItemB.id,
      nonItemC.id,
      itemOnTop.id,
    ]);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.isExerted(upgradedChemPurse)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("discard");
  });

  it("negative — cannot activate without another item to banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [upgradedChemPurse],
      deck: [itemOnTop],
    });

    const result = testEngine.asPlayerOne().activateAbility(upgradedChemPurse, {
      ability: "IT'S GOT POCKETS!",
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(upgradedChemPurse)).toBe(false);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("negative — requires 1 ink", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, otherItem],
      deck: [itemOnTop],
    });

    const result = testEngine.asPlayerOne().activateAbility(upgradedChemPurse, {
      ability: "IT'S GOT POCKETS!",
      costs: { banishItems: [otherItem] },
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(upgradedChemPurse)).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("play");
  });
});

describe("Upgraded Chem Purse other-instance cost", () => {
  it("can banish another copy of the Purse while keeping the activating copy", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [upgradedChemPurse, upgradedChemPurse],
      inkwell: 1,
      deck: [itemOnTop],
    });
    const [source, cost] = g.getCardInstanceIdsInZone("play", PLAYER_ONE);
    expect(
      g.asPlayerOne().activateAbility(source!, {
        ability: "IT'S GOT POCKETS!",
        costs: { banishItems: [cost!] },
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(source!)).toBe("play");
    expect(g.isExerted(source!)).toBe(true);
    expect(g.asPlayerOne().getCardZone(cost!)).toBe("discard");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(
      g.asPlayerOne().resolvePendingByCard(source!, {
        destinations: [
          { zone: "hand", cards: [itemOnTop] },
          { zone: "deck-bottom", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(itemOnTop)).toBe("hand");
  });
});
