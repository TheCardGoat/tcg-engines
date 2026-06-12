import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { holdStill } from "../../002/actions/028-hold-still";
import { isabelaMadrigalPerfectlyInControl } from "./153-isabela-madrigal-perfectly-in-control";
import { brunoMadrigalOasisOracle } from "./154-bruno-madrigal-oasis-oracle";

const damagedAlly = createMockCharacter({
  id: "bruno-oasis-damaged-ally",
  name: "Damaged Ally",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const secondDamagedAlly = createMockCharacter({
  id: "bruno-oasis-damaged-ally-2",
  name: "Damaged Ally 2",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

const topCard = createMockCharacter({
  id: "bruno-oasis-top-card",
  name: "Top Card",
  cost: 1,
});

const secondCard = createMockCharacter({
  id: "bruno-oasis-second-card",
  name: "Second Card",
  cost: 2,
});

describe("Bruno Madrigal - Oasis Oracle", () => {
  it("is no longer marked as missing executable coverage", () => {
    expect(brunoMadrigalOasisOracle.missingImplementation).toBeUndefined();
    expect(brunoMadrigalOasisOracle.missingTests).toBeUndefined();
  });

  describe("FIND THAT VISION - Once during your turn, whenever you remove damage from one of your characters, you may look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.", () => {
    it("triggers a scry selection when you remove damage from one of your characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [brunoMadrigalOasisOracle, { card: damagedAlly, damage: 2 }],
          hand: [holdStill],
          inkwell: holdStill.cost,
          deck: [topCard, secondCard],
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCard(holdStill, { targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Bruno's ability goes into the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(brunoMadrigalOasisOracle, { resolveOptional: true }),
      ).toBeSuccessfulCommand();

      // Scry selection: hand + deck-bottom
      const pending = testEngine.asServer().getState().G.pendingEffects[0];
      expect(pending?.kind).toBe("scry-selection");
      const revealedCardIds = pending?.resolutionInput.eventSnapshot?.revealedCardIds as
        | string[]
        | undefined;
      expect(revealedCardIds).toHaveLength(2);
      const [firstRevealedId, secondRevealedId] = revealedCardIds!;

      expect(
        testEngine.asPlayerOne().resolvePendingEffect(brunoMadrigalOasisOracle, {
          destinations: [
            { zone: "hand", cards: [firstRevealedId] },
            { zone: "deck-bottom", cards: [secondRevealedId] },
          ],
        }),
      ).toBeSuccessfulCommand();

      // First looked-at card in hand, other on the bottom of deck
      expect(testEngine.asPlayerOne().getCardZone(topCard)).toBe("hand");
      const deckInstanceIds = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const bottomCardId = deckInstanceIds.at(-1);
      expect(bottomCardId).toBeDefined();
      expect(testEngine.getCardDefinitionId(bottomCardId!)).toBe(secondCard.id);
    });

    it("only triggers once per turn", () => {
      const thirdHoldStill = {
        ...holdStill,
        id: `${holdStill.id}-2`,
      };

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            brunoMadrigalOasisOracle,
            { card: damagedAlly, damage: 2 },
            { card: secondDamagedAlly, damage: 2 },
          ],
          hand: [holdStill, thirdHoldStill],
          inkwell: holdStill.cost * 2,
          deck: [topCard, secondCard],
        },
        {},
      );

      expect(
        testEngine.asPlayerOne().playCard(holdStill, { targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // First remove-damage: FIND THAT VISION triggers once
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(brunoMadrigalOasisOracle, { resolveOptional: false }),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Second remove-damage in the same turn — must NOT trigger again
      expect(
        testEngine.asPlayerOne().playCard(thirdHoldStill, { targets: [secondDamagedAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });

  describe("YOU'LL BE OKAY - Whenever this character quests, you may remove all damage from chosen character.", () => {
    it("removes all damage from chosen character when Bruno quests", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: brunoMadrigalOasisOracle, isDrying: false },
          { card: damagedAlly, damage: 4 },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(brunoMadrigalOasisOracle)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(brunoMadrigalOasisOracle, { resolveOptional: true }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedAlly, value: 0 });
    });

    it("can be declined (optional)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [
          { card: brunoMadrigalOasisOracle, isDrying: false },
          { card: damagedAlly, damage: 3 },
        ],
        deck: 5,
      });

      expect(testEngine.asPlayerOne().quest(brunoMadrigalOasisOracle)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(brunoMadrigalOasisOracle, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne()).toHaveDamage({ card: damagedAlly, value: 3 });
    });
  });

  describe("release notes ruling", () => {
    it("Find That Vision triggers when damage is MOVED from one of your characters (moving counts as removing)", () => {
      // Q&A: Moving damage counts as removing damage; Find That Vision must
      // trigger on damage moves.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            brunoMadrigalOasisOracle,
            { card: isabelaMadrigalPerfectlyInControl, isDrying: false },
            { card: damagedAlly, damage: 2 },
          ],
          deck: [topCard, secondCard],
        },
        {},
      );

      // Move damage via Isabela – Perfectly in Control's quest ability.
      expect(
        testEngine.asPlayerOne().quest(isabelaMadrigalPerfectlyInControl),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(isabelaMadrigalPerfectlyInControl, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [damagedAlly] }),
      ).toBeSuccessfulCommand();

      // Bruno's Find That Vision should now be in the bag.
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    });
  });
});
