import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { theHeadlessHorsemanCursedRider } from "./174-the-headless-horseman-cursed-rider";
import { hudsonDeterminedReader } from "./180-hudson-determined-reader";
import { theGamesAfoot } from "../actions/198-the-games-afoot";

const deckFiller = createMockCharacter({
  id: "horseman-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
});

const mockAction = createMockAction({
  id: "horseman-mock-action",
  name: "Mock Action",
  cost: 1,
});

const bigTarget = createMockCharacter({
  id: "horseman-big-target",
  name: "Big Target",
  cost: 5,
  strength: 5,
  willpower: 12,
  lore: 2,
});

describe("The Headless Horseman - Cursed Rider", () => {
  describe("WITCHING HOUR ability", () => {
    it("both players draw 3 cards and discard 3 cards at random - no action cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theHeadlessHorsemanCursedRider],
          inkwell: theHeadlessHorsemanCursedRider.cost,
          deck: [deckFiller, deckFiller, deckFiller],
        },
        {
          deck: [deckFiller, deckFiller, deckFiller],
          play: [bigTarget],
        },
      );

      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(3);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().deck).toBe(3);

      expect(
        testEngine.asPlayerOne().playCard(theHeadlessHorsemanCursedRider),
      ).toBeSuccessfulCommand();

      // The bag requires target selection (opposing character present). Resolve it with a target.
      // No action cards are in the deck so the conditional skips deal-damage.
      const targetId = testEngine.findCardInstanceId(bigTarget, "play", PLAYER_TWO);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theHeadlessHorsemanCursedRider, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // After drawing 3 and discarding 3:
      // Player 1: had 1 (Horseman) - 1 (played) + 3 (drew) = 3, then - 3 (discarded) = 0
      // Player 2: had 0 + 3 (drew) = 3, then - 3 (discarded) = 0
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerTwo().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(3);
      expect(testEngine.asPlayerTwo().getZonesCardCount().discard).toBe(3);

      // No action cards → deal-damage was skipped, bigTarget should have 0 damage
      expect(testEngine.asPlayerTwo().getDamage(bigTarget)).toBe(0);
    });

    it("deals 2 damage per action card discarded - 1 action card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theHeadlessHorsemanCursedRider],
          inkwell: theHeadlessHorsemanCursedRider.cost,
          // theGamesAfoot is an action card; deck order matters (top drawn first)
          deck: [theGamesAfoot, deckFiller, deckFiller],
        },
        {
          deck: [deckFiller, deckFiller, deckFiller],
          play: [bigTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(theHeadlessHorsemanCursedRider),
      ).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(bigTarget, "play", PLAYER_TWO);
      // The bag requires target selection for the conditional deal-damage step.
      // Passing the target to resolveNextBag lets the sequence run (draw, discard, count)
      // and then applies deal-damage to the chosen character.
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theHeadlessHorsemanCursedRider, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // 1 action card discarded = 2 damage
      expect(testEngine.asPlayerTwo().getDamage(bigTarget)).toBe(2);
    });

    it("deals 2 damage per action card discarded - multiple action cards from both players", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theHeadlessHorsemanCursedRider],
          inkwell: theHeadlessHorsemanCursedRider.cost,
          deck: [theGamesAfoot, theGamesAfoot, deckFiller], // 2 actions
        },
        {
          deck: [theGamesAfoot, deckFiller, deckFiller], // 1 action
          play: [bigTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(theHeadlessHorsemanCursedRider),
      ).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(bigTarget, "play", PLAYER_TWO);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theHeadlessHorsemanCursedRider, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // 3 action cards * 2 damage = 6 damage (should banish bigTarget with willpower 12? No, 6 < 12)
      expect(testEngine.asPlayerTwo().getDamage(bigTarget)).toBe(6);
    });

    it("deals 2 damage per action card discarded - all 6 cards are action cards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theHeadlessHorsemanCursedRider],
          inkwell: theHeadlessHorsemanCursedRider.cost,
          deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
        },
        {
          deck: [theGamesAfoot, theGamesAfoot, theGamesAfoot],
          play: [bigTarget],
        },
      );

      const targetId = testEngine.findCardInstanceId(bigTarget, "play", PLAYER_TWO);

      expect(
        testEngine.asPlayerOne().playCard(theHeadlessHorsemanCursedRider),
      ).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theHeadlessHorsemanCursedRider, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // 6 action cards * 2 damage = 12 damage → banishes bigTarget (willpower 12)
      expect(
        testEngine.getAuthoritativeState().ctx.zones.private.cardIndex[targetId]?.zoneKey,
      ).toBe(`discard:${PLAYER_TWO}`);
    });

    it("targets only opposing characters for damage", () => {
      const myCharacter = createMockCharacter({
        id: "horseman-my-character",
        name: "My Character",
        cost: 2,
        strength: 2,
        willpower: 5,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [theHeadlessHorsemanCursedRider],
          inkwell: theHeadlessHorsemanCursedRider.cost,
          deck: [theGamesAfoot, deckFiller, deckFiller],
          play: [myCharacter],
        },
        {
          deck: [deckFiller, deckFiller, deckFiller],
          play: [bigTarget],
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(theHeadlessHorsemanCursedRider),
      ).toBeSuccessfulCommand();

      const targetId = testEngine.findCardInstanceId(bigTarget, "play", PLAYER_TWO);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(theHeadlessHorsemanCursedRider, { targets: [targetId] }),
      ).toBeSuccessfulCommand();

      // Own character should not be damaged
      expect(testEngine.asPlayerOne().getDamage(myCharacter)).toBe(0);
      // Opponent character should take damage
      expect(testEngine.asPlayerTwo().getDamage(bigTarget)).toBe(2);
    });
  });
});
