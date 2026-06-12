import { describe, expect, it } from "bun:test";
import type { ZoneId } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { lyleTiberiusRourkeAdventurerForHire } from "./087-lyle-tiberius-rourke-adventurer-for-hire";

const drawnCard = createMockCharacter({
  id: "lyle-drawn-card",
  name: "Drawn Card",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const discardFodder = createMockCharacter({
  id: "lyle-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const discardFodder2 = createMockCharacter({
  id: "lyle-discard-fodder-2",
  name: "Discard Fodder 2",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Lyle Tiberius Rourke - Adventurer for Hire", () => {
  describe("EYE FOR VALUE - When you play this character, you may draw a card, then choose and discard a card.", () => {
    it("draws a card then discards a chosen card when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: lyleTiberiusRourkeAdventurerForHire.cost,
        deck: [drawnCard],
        hand: [lyleTiberiusRourkeAdventurerForHire, discardFodder],
      });

      expect(
        testEngine.asPlayerOne().playCard(lyleTiberiusRourkeAdventurerForHire),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Accept the optional: draws 1 from deck
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lyleTiberiusRourkeAdventurerForHire, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 0,
        hand: 2,
        play: 1,
      });

      // Choose a card to discard
      const discardFodderId = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [discardFodderId] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 0,
        discard: 1,
        hand: 1,
        play: 1,
      });
    });

    it("can decline the optional trigger on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: lyleTiberiusRourkeAdventurerForHire.cost,
        deck: [drawnCard],
        hand: [lyleTiberiusRourkeAdventurerForHire, discardFodder],
      });

      expect(
        testEngine.asPlayerOne().playCard(lyleTiberiusRourkeAdventurerForHire),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline the optional
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(lyleTiberiusRourkeAdventurerForHire, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      // Nothing drawn, nothing discarded
      expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("deck");
      expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("hand");
      expect(testEngine.asPlayerOne().getZonesCardCount()).toMatchObject({
        deck: 1,
        discard: 0,
        hand: 1,
        play: 1,
      });
    });
  });

  describe("DIRTY TRICKS - At the end of your turn, if 2 or more cards were put into your discard this turn, each opponent loses 1 lore.", () => {
    it("causes each opponent to lose 1 lore at end of turn when 2+ cards entered your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lyleTiberiusRourkeAdventurerForHire],
          hand: [discardFodder, discardFodder2],
          deck: 3,
        },
        {
          deck: 3,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 3,
          },
        },
      );

      // Manually move two cards from hand to discard to satisfy the 2+ discard metric.
      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      const fodder2Id = testEngine.findCardInstanceId(discardFodder2, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asServer().manualMoveCard(fodder2Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Resolve any pending end-of-turn trigger
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(lyleTiberiusRourkeAdventurerForHire),
        ).toBeSuccessfulCommand();
      }

      // Player two is the only opponent and should have lost 1 lore (3 -> 2)
      expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
    });

    it("does not cause opponents to lose lore when fewer than 2 cards entered your discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lyleTiberiusRourkeAdventurerForHire],
          hand: [discardFodder],
          deck: 3,
        },
        {
          deck: 3,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 3,
          },
        },
      );

      // Only 1 card put into discard — condition (2+) should fail
      const fodder1Id = testEngine.findCardInstanceId(discardFodder, "hand", PLAYER_ONE);
      expect(
        testEngine.asServer().manualMoveCard(fodder1Id, `discard:${PLAYER_ONE}` as ZoneId),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // No effects to resolve from Lyle
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });

    it("does not trigger when no cards entered your discard this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [lyleTiberiusRourkeAdventurerForHire],
          deck: 3,
        },
        {
          deck: 3,
        },
        {
          startingLore: {
            [PLAYER_ONE]: 0,
            [PLAYER_TWO]: 3,
          },
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent's lore should remain unchanged (condition not met)
      expect(testEngine.getLore(PLAYER_TWO)).toBe(3);
    });
  });
});
