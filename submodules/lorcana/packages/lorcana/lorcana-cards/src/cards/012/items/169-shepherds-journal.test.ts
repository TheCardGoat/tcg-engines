import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { shepherdsJournal } from "./169-shepherds-journal";

const deckTopCard = createMockCharacter({
  id: "shepherds-journal-top-card",
  name: "Top Card",
  cost: 1,
});

const otherItem = createMockItem({
  id: "shepherds-journal-other-item",
  name: "Other Item",
  cost: 2,
});

const anotherItem = createMockItem({
  id: "shepherds-journal-another-item",
  name: "Another Item",
  cost: 3,
});

describe("Shepherd's Journal", () => {
  it("MARGIN NOTES - when played, looks at the top card of your deck and keeps it on top", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shepherdsJournal],
      inkwell: shepherdsJournal.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(shepherdsJournal)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shepherdsJournal, {
        resolveOptional: true,
        destinations: [
          { zone: "deck-top", cards: [deckTopCard] },
          { zone: "discard", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(shepherdsJournal)).toBe("play");
  });

  it("MARGIN NOTES - when played, the player may put the top card into their discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shepherdsJournal],
      inkwell: shepherdsJournal.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(shepherdsJournal)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shepherdsJournal, {
        resolveOptional: true,
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "discard", cards: [deckTopCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("discard");
  });

  it("MARGIN NOTES - the optional ability can be declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [shepherdsJournal],
      inkwell: shepherdsJournal.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(shepherdsJournal)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(shepherdsJournal, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckTopCard.id]);
  });

  describe("release notes ruling", () => {
    it("declining the optional 'may look at top card' means the second part doesn't happen — top card is unchanged and stays on top", () => {
      // Q&A: With "may", choosing not to look means there's no card to
      // reference for the put-on-top/discard step, so nothing moves.
      const secondDeckCard = createMockCharacter({
        id: "shepherds-release-second",
        name: "Second Card",
        cost: 2,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [shepherdsJournal],
        inkwell: shepherdsJournal.cost,
        deck: [deckTopCard, secondDeckCard],
      });

      expect(testEngine.asPlayerOne().playCard(shepherdsJournal)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(shepherdsJournal, {
          resolveOptional: false,
        }),
      ).toBeSuccessfulCommand();

      // Top card unchanged.
      expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
      const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);
      expect(deckIds[0]).toBe(deckTopCard.id);
    });
  });

  it("KEY TO THE PUZZLE 1 - banishes itself for 1 ink to return an item card from discard to hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [shepherdsJournal],
      discard: [otherItem],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(shepherdsJournal, {
        ability: "KEY TO THE PUZZLE 1",
        targets: [otherItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shepherdsJournal)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("hand");
  });

  it("KEY TO THE PUZZLE 1 - lets the controller choose which item to return", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 1,
      play: [shepherdsJournal],
      discard: [otherItem, anotherItem],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(shepherdsJournal, {
        ability: "KEY TO THE PUZZLE 1",
        targets: [anotherItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(shepherdsJournal)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(anotherItem)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(otherItem)).toBe("discard");
  });
});
