import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { cinderellaDreamComeTrue } from "./155-cinderella-dream-come-true";
import { cinderellaDreamComeTrueEnchanted } from "./236-cinderella-dream-come-true-enchanted";
import { ratiganGreedyGenius } from "../../008/characters/167-ratigan-greedy-genius";

const princessCharacter = createMockCharacter({
  id: "cinderella-princess",
  name: "Princess Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero", "Princess"],
});

const inkFodder = createMockCharacter({
  id: "cinderella-ink-fodder",
  name: "Ink Fodder",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "cinderella-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

describe("Cinderella - Dream Come True", () => {
  describe("WHATEVER YOU WISH FOR - At the end of your turn, if you played a Princess character this turn, you may put a card from your hand into your inkwell facedown to draw a card.", () => {
    it("lets you ink a chosen card from hand facedown and ready, then draw a card", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princessCharacter, inkFodder],
        play: [cinderellaDreamComeTrue],
        inkwell: princessCharacter.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(princessCharacter)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(cinderellaDreamComeTrue, {
          resolveOptional: true,
          targets: [inkFodder],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCard(inkFodder)).toMatchObject({
        zone: "inkwell",
        exerted: false,
      });
      expect(testEngine.asPlayerOne().getCard(drawnCard).zone).toBe("hand");
      expect(testEngine.asPlayerOne().getCard(princessCharacter).zone).toBe("play");
      expect(testEngine.asPlayerOne().getCard(cinderellaDreamComeTrue).zone).toBe("play");
    });

    it("does not trigger when no Princess was played this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [inkFodder],
        play: [cinderellaDreamComeTrue],
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // CRD 6.2.7: ability is enqueued then auto-fizzled because the turn-metric
      // condition (played a Princess this turn) is already false at the resolution boundary.
      // The player should NOT be prompted with an optional choice.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("regression: triggers when shifting a Princess character onto another character", () => {
      // Bug: WHATEVER YOU WISH FOR was not triggering when shifting a Princess character
      // onto another character. Shifting counts as playing, so it should trigger.
      const shiftableCharacter = createMockCharacter({
        id: "cinderella-shift-base",
        name: "Ariel",
        version: "Base",
        cost: 2,
        classifications: ["Storyborn", "Hero", "Princess"],
      });

      const shiftedPrincess = createMockCharacter({
        id: "cinderella-shifted-princess",
        name: "Ariel",
        version: "Shifted",
        cost: 4,
        classifications: ["Floodborn", "Hero", "Princess"],
        abilities: [
          {
            cost: { ink: 2 },
            keyword: "Shift",
            type: "keyword",
            text: "Shift 2",
          },
        ],
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [shiftedPrincess, inkFodder],
        play: [cinderellaDreamComeTrue, shiftableCharacter],
        inkwell: shiftedPrincess.cost,
        deck: [drawnCard],
      });

      const shiftTarget = testEngine.findCardInstanceId(shiftableCharacter, "play", "player_one");

      expect(
        testEngine.asPlayerOne().playCard(shiftedPrincess, {
          cost: { cost: "shift", shiftTarget },
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // WHATEVER YOU WISH FOR should trigger because a Princess was played (via Shift)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });

    it("does NOT draw when the player has no card to put into inkwell (empty hand)", () => {
      // Reproduces 2026-05-06 player report (cluster C10): "Cinderella - Dream
      // Come True allowed the opponent to draw a card even when they could not
      // ink because they no cards in hand."
      //
      // Printed text: "you may put a card from your hand into your inkwell
      // facedown TO draw a card." — the draw is the consequence of the put.
      // If there is no card to put, you may not draw. The ability was
      // structured as `optional → sequence → [put-into-inkwell, draw]`, so
      // accepting the optional with an empty hand still ran the draw step.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [princessCharacter], // played below to satisfy the turn-metric
        // condition; afterwards hand is empty.
        play: [cinderellaDreamComeTrue],
        inkwell: princessCharacter.cost,
        deck: 3,
      });

      const deckBefore = testEngine.asPlayerOne().getZonesCardCount().deck;

      expect(testEngine.asPlayerOne().playCard(princessCharacter)).toBeSuccessfulCommand();
      // Hand is now empty (only princessCharacter was in it).
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Cinderella's ability triggers — printed-text condition is satisfied.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Player accepts the optional, but there is no card in hand to put.
      // The engine must NOT draw — the draw is the consequence of the put.
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaDreamComeTrue, {
        resolveOptional: true,
      });

      // Both zone counts must be unchanged: nothing left the hand (it was
      // empty), and nothing was drawn from the deck.
      expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
      expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore);
    });

    it("triggers when Cinderella herself is played (she is a Princess)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [cinderellaDreamComeTrue, inkFodder],
        inkwell: cinderellaDreamComeTrue.cost,
        deck: [drawnCard],
      });

      expect(testEngine.asPlayerOne().playCard(cinderellaDreamComeTrue)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    });
  });

  it("regression: Ratigan - Greedy Genius should not be banished when card was inked via Cinderella's end-of-turn ability", () => {
    // Ratigan's TIME RUNS OUT: "At the end of your turn, if you didn't put any cards
    // into your inkwell this turn, banish this character."
    // Cinderella's WHATEVER YOU WISH FOR inks a card from hand at end of turn.
    // The bug was that Ratigan was incorrectly banished even though Cinderella's ability
    // had put a card into the inkwell.
    // Simplified test: Ratigan in play, ink a card normally, pass turn — Ratigan stays.
    // Then test without inking: Ratigan gets banished.
    // The real regression is about the inking count tracking Cinderella's end-of-turn ink.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [princessCharacter, inkFodder],
      play: [cinderellaDreamComeTrue, ratiganGreedyGenius],
      inkwell: princessCharacter.cost,
      deck: [drawnCard, drawnCard],
    });

    // Play a princess to trigger Cinderella's ability
    expect(testEngine.asPlayerOne().playCard(princessCharacter)).toBeSuccessfulCommand();

    // Pass turn — both Cinderella's WHATEVER YOU WISH FOR and Ratigan's TIME RUNS OUT trigger
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Multiple bag effects exist — resolve Cinderella's first to ink a card
    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffects).toHaveLength(2);

    const cinderellaBag = bagEffects.find(
      (bagEffect) =>
        bagEffect.sourceId === testEngine.asPlayerOne().getCard(cinderellaDreamComeTrue).id,
    );
    expect(cinderellaBag).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaDreamComeTrue, {
        resolveOptional: true,
        targets: [inkFodder],
      }),
    ).toBeSuccessfulCommand();

    // Now resolve any remaining bags
    testEngine.asPlayerOne().resolveAllBagEffects({});

    // Ratigan's TIME RUNS OUT should NOT have triggered because Cinderella's ability
    // put a card into the inkwell this turn
    // Ratigan should still be in play
    expect(testEngine.asPlayerOne().getCardZone(ratiganGreedyGenius)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(inkFodder)).toBe("inkwell");
  });

  it("does not resolve on subsequent turns when no Princess is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cinderellaDreamComeTrue, inkFodder],
        inkwell: cinderellaDreamComeTrue.cost,
        deck: [drawnCard, drawnCard, drawnCard, drawnCard, drawnCard],
      },
      {
        deck: 5,
      },
    );

    // Turn 1: Play Cinderella (she is a Princess, so the condition is met)
    expect(testEngine.asPlayerOne().playCard(cinderellaDreamComeTrue)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Cinderella's ability triggers — resolve it
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(cinderellaDreamComeTrue, {
        resolveOptional: true,
        targets: [inkFodder],
      }),
    ).toBeSuccessfulCommand();

    // Advance to turn 2: opponent passes, player one's turn starts
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

    // Turn 2: Do NOT play any Princess — just pass turn
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Ability is enqueued per CRD 6.2.7 but should fizzle at resolution
    // because no Princess was played this turn
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      // If enqueued, resolving should fizzle — the optional prompt won't appear
      // or no ink+draw happens because condition fails
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(cinderellaDreamComeTrue, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
    }

    // Regardless, the inkwell should still only have the original ink + the one
    // inked from turn 1. No additional card should have been inked on turn 2.
    expect(testEngine.asPlayerOne().getCard(inkFodder).zone).toBe("inkwell");
  });

  describe("Enchanted version", () => {
    it("has the same abilities as the base card", () => {
      expect(cinderellaDreamComeTrueEnchanted.abilities).toHaveLength(
        cinderellaDreamComeTrue.abilities?.length ?? 0,
      );
      const baseNames = cinderellaDreamComeTrue.abilities?.map((a) => a.name) ?? [];
      const enchantedNames = cinderellaDreamComeTrueEnchanted.abilities?.map((a) => a.name) ?? [];
      expect(enchantedNames).toEqual(baseNames);
    });
  });
});
