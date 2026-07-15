import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { kristoffIcyExplorer } from "./051-kristoff-icy-explorer";
import { annaSoothingSister } from "./050-anna-soothing-sister";
import { jiminyCricketGhostOfChristmasPast } from "./146-jiminy-cricket-ghost-of-christmas-past";

const discardFodder = createMockCharacter({
  id: "kristoff-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const secondDiscardFodder = createMockCharacter({
  id: "kristoff-discard-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Kristoff - Icy Explorer", () => {
  describe("HIDDEN DEPTHS - When you play this character, if you have a character named Anna in play, you may put a card from chosen player's discard on the bottom of their deck", () => {
    it("should not trigger when Anna is NOT in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        discard: [discardFodder],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should trigger when Anna is in play and put own discard card on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [discardFodder],
        deck: 5,
      });

      const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();

      // Triggered ability should be on the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Accept the optional ability and target the discard card
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kristoffIcyExplorer, {
          resolveOptional: true,
          targets: [discardId],
        }),
      ).toBeSuccessfulCommand();

      // Card should now be in deck
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("deck");
      // Deck count: +1 from moving fodder, -1 from STROKE OF LUCK draw = net 0
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });

    it("should put a card from opponent's discard on bottom of their deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [kristoffIcyExplorer],
          inkwell: kristoffIcyExplorer.cost,
          play: [{ card: annaSoothingSister, isDrying: false }],
          deck: 5,
        },
        {
          discard: [discardFodder],
          deck: 5,
        },
      );

      const opponentDiscardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_TWO);
      const initialOpponentDeckCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").deck;
      const initialOpponentDiscardCount = testEngine
        .asPlayerTwo()
        .getZonesCardCount("player_two").discard;

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kristoffIcyExplorer, {
          resolveOptional: true,
          targets: [opponentDiscardId],
        }),
      ).toBeSuccessfulCommand();

      // Card should be moved to opponent's deck
      expect(testEngine.asPlayerTwo().getCardZone(discardFodder)).toBe("deck");
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").deck).toBe(
        initialOpponentDeckCount + 1,
      );
      expect(testEngine.asPlayerTwo().getZonesCardCount("player_two").discard).toBe(
        initialOpponentDiscardCount - 1,
      );
    });

    it("regression: resolveBag with empty targets drains when Anna is NOT in play", () => {
      // Repro of player report: Kristoff solo on the board (no Anna), player
      // clicks "Resolve triggered ability" which submits `{ targets: [] }`.
      // With the new trigger-time condition check, the ability never enters
      // the bag when Anna is NOT in play, so there's nothing to drain.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        discard: [discardFodder],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();
      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    });

    it("regression: resolveBag with empty targets declines when Anna IS in play but all discards are empty", () => {
      // Anna is in play so the intervening-if passes, but no cards exist in
      // any discard, so there's no valid target for put-on-bottom. The
      // optional must auto-decline rather than stalling the bag.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        play: [{ card: annaSoothingSister, isDrying: false }],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("should be optional - player can decline when Anna is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [discardFodder],
        deck: 5,
      });

      const initialDiscardCount = testEngine.asPlayerOne().getZonesCardCount("player_one").discard;

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

      // Decline the optional ability
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(kristoffIcyExplorer, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Card should still be in discard
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").discard).toBe(
        initialDiscardCount,
      );
    });
  });

  describe("STROKE OF LUCK - Once during your turn, whenever a card leaves your discard, draw a card", () => {
    it("should draw a card when HIDDEN DEPTHS moves a card from your discard to deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [kristoffIcyExplorer],
        inkwell: kristoffIcyExplorer.cost,
        play: [{ card: annaSoothingSister, isDrying: false }],
        discard: [discardFodder],
        deck: 5,
      });

      const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;

      expect(testEngine.asPlayerOne().playCard(kristoffIcyExplorer)).toBeSuccessfulCommand();

      // Resolve HIDDEN DEPTHS - move card from discard to deck
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(kristoffIcyExplorer, {
          resolveOptional: true,
          targets: [discardId],
        }),
      ).toBeSuccessfulCommand();

      // After playing Kristoff and resolving HIDDEN DEPTHS:
      // - Kristoff was in hand (1 card) -> now in play
      // - HIDDEN DEPTHS moved discardFodder from discard to deck (+1 deck)
      // - STROKE OF LUCK triggered, drew 1 card (+1 hand, -1 deck)
      // Net deck change: +1 - 1 = 0
      // Hand: was 1 (Kristoff), played Kristoff = 0, drew 1 = 1
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(1);
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(initialDeckCount);
    });

    it("should only trigger once per turn even when multiple cards leave discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: kristoffIcyExplorer, isDrying: false }],
        discard: [discardFodder, secondDiscardFodder],
        deck: 5,
      });

      const firstDiscardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      const secondDiscardId = testEngine.findCardInstanceId(
        secondDiscardFodder,
        "discard",
        PLAYER_ONE,
      );

      // Manually move a card from discard to deck using manualMoveCard
      const initialDeckCount = testEngine.asPlayerOne().getZonesCardCount("player_one").deck;
      const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

      // Move first card from discard - should trigger STROKE OF LUCK
      expect(
        testEngine.asPlayerOne().manualMoveCard(firstDiscardId, "deck:player_one" as ZoneId),
      ).toBeSuccessfulCommand();

      // STROKE OF LUCK should have auto-resolved (drawn 1 card)
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
        initialHandCount + 1,
      );
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").deck).toBe(
        initialDeckCount + 1 - 1, // +1 from move, -1 from draw
      );

      // Move second card from discard - should NOT trigger STROKE OF LUCK (once per turn)
      expect(
        testEngine.asPlayerOne().manualMoveCard(secondDiscardId, "deck:player_one" as ZoneId),
      ).toBeSuccessfulCommand();

      // Hand should NOT have increased again (STROKE OF LUCK already used this turn)
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
        initialHandCount + 1,
      );
    });

    it("should NOT trigger during the opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: kristoffIcyExplorer, isDrying: false }],
          discard: [discardFodder],
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
      const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

      // Pass turn to opponent
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent moves player one's discard card (simulated via server)
      // During opponent's turn, STROKE OF LUCK should NOT trigger
      expect(
        testEngine.asPlayerTwo().manualMoveCard(discardId, "deck:player_one" as ZoneId),
      ).toBeSuccessfulCommand();

      // Hand count should not have changed (no draw triggered)
      expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(initialHandCount);
      // No bag effects either
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  it("regression: STROKE OF LUCK triggers when Pull the Lever puts a card from discard to deck bottom", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: kristoffIcyExplorer, isDrying: false },
        { card: annaSoothingSister, isDrying: false },
      ],
      discard: [discardFodder],
      deck: 5,
    });

    const discardId = testEngine.findCardInstanceId(discardFodder, "discard", PLAYER_ONE);
    const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

    // Simulate Pull the Lever putting a card from discard on bottom of deck
    expect(
      testEngine.asPlayerOne().manualMoveCard(discardId, "deck:player_one" as ZoneId),
    ).toBeSuccessfulCommand();

    // STROKE OF LUCK should trigger because a card left the discard
    expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
      initialHandCount + 1,
    );
  });

  it("regression: STROKE OF LUCK triggers when Jiminy Cricket's boost moves a card from discard to inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: kristoffIcyExplorer, isDrying: false }, jiminyCricketGhostOfChristmasPast],
      discard: [discardFodder],
      deck: 5,
      inkwell: 10,
    });

    const initialHandCount = testEngine.asPlayerOne().getZonesCardCount("player_one").hand;

    // Activate Jiminy Cricket's Boost ability (puts top card of deck under Jiminy)
    expect(
      testEngine.asPlayerOne().activateAbility(jiminyCricketGhostOfChristmasPast, {
        ability: "Boost",
        preventAutoResolveTriggeredEffects: true,
      }),
    ).toBeSuccessfulCommand();

    // LOOK INTO YOUR PAST triggers - accept it to move a card from discard to inkwell
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jiminyCricketGhostOfChristmasPast, {
        resolveOptional: true,
        targets: [discardFodder],
      }),
    ).toBeSuccessfulCommand();

    // The card left the discard (moved to inkwell), so STROKE OF LUCK should trigger
    // Kristoff should have drawn a card
    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getZonesCardCount("player_one").hand).toBe(
      initialHandCount + 1,
    );
  });

  describe("Stats and basic properties", () => {
    it("should have correct stats", () => {
      expect(kristoffIcyExplorer.cost).toBe(4);
      expect(kristoffIcyExplorer.strength).toBe(4);
      expect(kristoffIcyExplorer.willpower).toBe(4);
      expect(kristoffIcyExplorer.lore).toBe(1);
    });

    it("should not be inkable", () => {
      expect(kristoffIcyExplorer.inkable).toBe(false);
    });

    it("should be amethyst color", () => {
      expect(kristoffIcyExplorer.inkType).toEqual(["amethyst"]);
    });

    it("should be rare rarity", () => {
      expect(kristoffIcyExplorer.rarity).toBe("rare");
    });

    it("should be from set 011", () => {
      expect(kristoffIcyExplorer.set).toBe("011");
    });

    it("should be card number 51", () => {
      expect(kristoffIcyExplorer.cardNumber).toBe(51);
    });
  });
});
