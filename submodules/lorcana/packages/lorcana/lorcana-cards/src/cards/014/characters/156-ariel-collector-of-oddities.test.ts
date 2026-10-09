import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { arielCollectorOfOddities } from "./156-ariel-collector-of-oddities";
import { breakCard } from "../../001/actions/196-break";

// CR 6.2.3–6.2.4: item plays enter the bag; secondary conditions are checked at resolution.
// https://files.disneylorcana.com/Comprehensive-Rules_2.2.0-EN.pdf

const uniqueItem = createMockItem({ id: "ariel-unique", name: "Novel Gadget", cost: 2 });
const copyItem = createMockItem({ id: "ariel-copy", name: "Novel Gadget", cost: 2 });
const otherItem = createMockItem({ id: "ariel-other", name: "Other Gadget", cost: 1 });

describe("Ariel - Collector of Oddities", () => {
  it("draws when a matching item leaves before the secondary condition resolves", () => {
    const remover = createMockItem({
      id: "ariel-name-remover",
      name: "Novel Gadget",
      cost: 0,
      abilities: [
        {
          type: "triggered",
          trigger: { event: "play", on: "SELF", timing: "when" },
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielCollectorOfOddities, uniqueItem],
      hand: [remover],
      deck: [otherItem, copyItem],
    });
    const top = g.findCardInstanceId(copyItem, "deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(remover)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(remover, { targets: [uniqueItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(uniqueItem)).toBe("discard");
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([top!]);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([otherItem.id]);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not draw when another matching item enters before resolution", () => {
    const summoner = createMockItem({
      id: "ariel-name-summoner",
      name: "Novel Gadget",
      cost: 0,
      abilities: [
        {
          type: "triggered",
          trigger: { event: "play", on: "SELF", timing: "when" },
          effect: { type: "play-card", from: "discard", cardType: "item", cost: "free" },
        },
      ],
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielCollectorOfOddities],
      hand: [summoner],
      discard: [copyItem],
      deck: [otherItem, uniqueItem],
    });
    const deck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(summoner)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(
      g.asPlayerOne().resolvePendingByCard(summoner, { targets: [copyItem] }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(copyItem)).toBe("play");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deck);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("unpaid Ariel entry preserves hand and ink without drawing", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arielCollectorOfOddities],
      play: [uniqueItem],
      inkwell: 4,
      deck: 3,
    });
    const originalDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(arielCollectorOfOddities)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(arielCollectorOfOddities)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(4);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(originalDeck);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("two Ariel copies each draw for a new item and each gain their own collection lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: arielCollectorOfOddities, isDrying: false },
        { card: arielCollectorOfOddities, isDrying: false },
      ],
      hand: [uniqueItem, copyItem],
      inkwell: 4,
      deck: 4,
    });
    const deck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const ariels = g
      .getCardInstanceIdsInZone("play", PLAYER_ONE)
      .filter((id) => g.getCardDefinitionId(id) === arielCollectorOfOddities.id);
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(2);
    expect(g.asPlayerOne().resolvePendingByCard(ariels[0]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deck.slice(0, 2));
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toContain(deck[3]!);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toContain(deck[2]!);
    expect(g.asPlayerOne().playCard(copyItem)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(ariels[0]!)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(deck.slice(0, 2));
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().quest(ariels[0]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(2);
    expect(g.asPlayerOne().quest(ariels[1]!)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(4);
  });

  it("paid Ariel entry costs five and does not draw for existing items", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arielCollectorOfOddities],
      play: [uniqueItem],
      inkwell: 5,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(arielCollectorOfOddities)).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(3);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().quest(arielCollectorOfOddities)).not.toBeSuccessfulCommand();
  });

  it("ordinary inking of Ariel gives one ready ink without a draw trigger", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [arielCollectorOfOddities],
      deck: 3,
    });
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, arielCollectorOfOddities),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(arielCollectorOfOddities)).toBe("inkwell");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(3);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
  });

  it("draws the exact top card after a new-name item is played", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielCollectorOfOddities],
      hand: [uniqueItem],
      inkwell: 2,
      deck: [copyItem, otherItem],
    });
    const topId = g.findCardInstanceId(otherItem, "deck", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toEqual([topId!]);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([copyItem.id]);
  });

  it("an opponent playing an item does not draw for Ariel's controller", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [arielCollectorOfOddities], deck: [copyItem, otherItem] },
      { hand: [uniqueItem], inkwell: 2, deck: 3 },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerTwo().getBagCount()).toBe(0);
  });

  it("player two draws only from their own deck and gains their collection lore", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [uniqueItem, otherItem] },
      {
        play: [{ card: arielCollectorOfOddities, isDrying: false }],
        hand: [uniqueItem],
        inkwell: 2,
        deck: [copyItem, otherItem, otherItem],
      },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const remainingTop = g.getCardInstanceIdsInZone("deck", PLAYER_TWO).at(-1);
    expect(g.asPlayerTwo().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_TWO)).toContain(remainingTop!);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck);
    expect(g.asPlayerTwo().quest(arielCollectorOfOddities)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_TWO)).toBe(2);
    expect(g.getLore(PLAYER_ONE)).toBe(0);
  });

  it("an empty deck creates no hand card when a new item triggers the draw", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [arielCollectorOfOddities],
      hand: [uniqueItem],
      inkwell: 2,
      deck: [],
    });
    expect(g.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asServer().getWinner()).toBeUndefined();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  for (const retainCopy of [false, true]) {
    it(`updates lore immediately after item removal; matching copy retained: ${retainCopy}`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: arielCollectorOfOddities, isDrying: false },
          uniqueItem,
          ...(retainCopy ? [copyItem] : []),
        ],
        hand: [breakCard],
        inkwell: 2,
        deck: 3,
      });
      expect(
        g.asPlayerOne().playCard(breakCard, { targets: [uniqueItem] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(uniqueItem)).toBe("discard");
      expect(g.asPlayerOne().quest(arielCollectorOfOddities)).toBeSuccessfulCommand();
      expect(g.getLore(PLAYER_ONE)).toBe(retainCopy ? 2 : 1);
    });
  }

  it("quests for one lore with no items in play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielCollectorOfOddities, isDrying: false }],
      deck: 3,
    });
    expect(g.asPlayerOne().quest(arielCollectorOfOddities)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("a failed item payment produces no draw or collection bonus", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: arielCollectorOfOddities, isDrying: false }],
      hand: [uniqueItem],
      inkwell: 1,
      deck: 3,
    });
    expect(g.asPlayerOne().playCard(uniqueItem)).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(uniqueItem)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toHaveLength(3);
    expect(g.asPlayerOne().quest(arielCollectorOfOddities)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
  });

  it("quests for base lore plus distinct item names, without counting duplicate or opposing items", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: arielCollectorOfOddities, isDrying: false },
          uniqueItem,
          copyItem,
          otherItem,
        ],
        deck: 3,
      },
      { play: [createMockItem({ id: "opponent-collection", name: "Opponent's Gadget", cost: 1 })] },
    );
    expect(game.asPlayerOne().quest(arielCollectorOfOddities)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);
  });

  it("an opponent's matching item does not stop the new-name draw", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [arielCollectorOfOddities],
        hand: [uniqueItem],
        inkwell: 2,
        deck: 3,
      },
      { play: [copyItem] },
    );
    expect(game.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(2);
  });

  it("draws a card when you play an item with a new name", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [uniqueItem],
        inkwell: 6,
        play: [arielCollectorOfOddities],
        deck: 1,
      },
      {},
    );

    // -1 for the played item, +1 for the draw.
    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(testEngine.asPlayerOne().playCard(uniqueItem)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore);
  });

  it("no draw when the played item's name matches an item already in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [copyItem],
        inkwell: 6,
        play: [arielCollectorOfOddities, uniqueItem],
        deck: 1,
      },
      {},
    );

    // -1 for the played item, no draw on a name match.
    const handBefore = testEngine.asPlayerOne().getZonesCardCount().hand;
    expect(testEngine.asPlayerOne().playCard(copyItem)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(handBefore - 1);
  });
});
