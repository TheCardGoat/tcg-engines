import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { ursulaWhisperOfVanessa } from "../../010/characters/059-ursula-whisper-of-vanessa";
import { littleJohnImpermanentOutlaw } from "../../010/characters/092-little-john-impermanent-outlaw";
import { donaldDuckFredHoneywell } from "./093-donald-duck-fred-honeywell";

describe("Donald Duck - Fred Honeywell", () => {
  describe("WELL WISHES - During opponents' turns, whenever one of your other characters is banished, you may draw a card for each card that was under them", () => {
    it("should draw 1 card when a character with 1 card under is banished during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
          deck: 5,
        },
      );

      // Set up: put 1 card under Little John via putCardUnder helper
      const littleJohnIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const littleJohnId = littleJohnIds.find(
        (id) => testEngine.getCardDefinitionId(id) === littleJohnImpermanentOutlaw.id,
      );
      expect(littleJohnId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard = deckCards[0];
      expect(deckCard).toBeDefined();

      testEngine.putCardUnder(littleJohnId!, deckCard!);
      expect(testEngine.getCardsUnder(littleJohnId!)).toHaveLength(1);

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      // Player one (opponent) banishes Little John during their turn
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // WELL WISHES triggers: player two may draw 1 card
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(donaldDuckFredHoneywell),
        ).toBeSuccessfulCommand();
      }

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore + 1);
    });

    it("should draw 2 cards when a character with 2 cards under is banished during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
          deck: 5,
        },
      );

      const littleJohnIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const littleJohnId = littleJohnIds.find(
        (id) => testEngine.getCardDefinitionId(id) === littleJohnImpermanentOutlaw.id,
      );
      expect(littleJohnId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard1 = deckCards[0];
      const deckCard2 = deckCards[1];
      expect(deckCard1).toBeDefined();
      expect(deckCard2).toBeDefined();

      testEngine.putCardUnder(littleJohnId!, deckCard1!);
      testEngine.putCardUnder(littleJohnId!, deckCard2!);
      expect(testEngine.getCardsUnder(littleJohnId!)).toHaveLength(2);

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // WELL WISHES triggers: player two may draw 2 cards
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(donaldDuckFredHoneywell),
        ).toBeSuccessfulCommand();
      }

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore + 2);
    });

    it("should NOT draw cards when a character with no cards under is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
          deck: 5,
        },
      );

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      // Banish Little John with no cards under him
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore);
    });

    it("should NOT trigger during your own turn", () => {
      // Setup: Donald and Little John both belong to player one
      // Player one banishes their own Little John (during their own turn)
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [dragonFire],
        inkwell: dragonFire.cost,
        play: [donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
        deck: 5,
      });

      const littleJohnIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const littleJohnId = littleJohnIds.find(
        (id) => testEngine.getCardDefinitionId(id) === littleJohnImpermanentOutlaw.id,
      );
      expect(littleJohnId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
      const deckCard = deckCards[0];
      expect(deckCard).toBeDefined();

      testEngine.putCardUnder(littleJohnId!, deckCard!);
      expect(testEngine.getCardsUnder(littleJohnId!)).toHaveLength(1);

      const handBefore = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;

      // Player one banishes Little John on their own turn
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // WELL WISHES should NOT trigger (own turn, not opponent's turn)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Hand: started with 1 (dragonFire), played it = 0; no draw
      const handAfter = testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count;
      expect(handAfter).toBe(handBefore - 1);
    });

    it("should NOT trigger when Donald himself is banished", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [donaldDuckFredHoneywell],
          deck: 5,
        },
      );

      // Put 1 card under Donald himself
      const donaldIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const donaldId = donaldIds.find(
        (id) => testEngine.getCardDefinitionId(id) === donaldDuckFredHoneywell.id,
      );
      expect(donaldId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard = deckCards[0];
      expect(deckCard).toBeDefined();

      testEngine.putCardUnder(donaldId!, deckCard!);

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      // Opponent banishes Donald
      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [donaldDuckFredHoneywell],
        }),
      ).toBeSuccessfulCommand();

      // WELL WISHES should NOT trigger (it's "other characters", not Donald himself)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore);
    });

    it("triggers independently for each Donald in play (R24)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          // Two Donalds + Little John (with cards under) on player two's board
          play: [donaldDuckFredHoneywell, donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
          deck: 10,
        },
      );

      const playIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const littleJohnId = playIds.find(
        (id) => testEngine.getCardDefinitionId(id) === littleJohnImpermanentOutlaw.id,
      );
      expect(littleJohnId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      testEngine.putCardUnder(littleJohnId!, deckCards[0]!);
      testEngine.putCardUnder(littleJohnId!, deckCards[1]!);
      expect(testEngine.getCardsUnder(littleJohnId!)).toHaveLength(2);

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // Both Donalds' WELL WISHES should trigger and resolve to drawing 2 cards each = 4 total.
      testEngine.asPlayerTwo().resolveAllBagEffects();

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore + 4);
    });

    it("should allow declining the optional draw", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [dragonFire],
          inkwell: dragonFire.cost,
          deck: 5,
        },
        {
          play: [donaldDuckFredHoneywell, littleJohnImpermanentOutlaw],
          deck: 5,
        },
      );

      const littleJohnIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_TWO);
      const littleJohnId = littleJohnIds.find(
        (id) => testEngine.getCardDefinitionId(id) === littleJohnImpermanentOutlaw.id,
      );
      expect(littleJohnId).toBeDefined();

      const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_TWO);
      const deckCard = deckCards[0];
      expect(deckCard).toBeDefined();

      testEngine.putCardUnder(littleJohnId!, deckCard!);

      const handBefore = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;

      expect(
        testEngine.asPlayerOne().playCard(dragonFire, {
          targets: [littleJohnImpermanentOutlaw],
        }),
      ).toBeSuccessfulCommand();

      // Decline the optional ability
      const bagEffects = testEngine.asPlayerTwo().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerTwo()
            .resolvePendingByCard(donaldDuckFredHoneywell, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      const handAfter = testEngine.asPlayerTwo().getCardsInZone("hand", PLAYER_TWO).count;
      expect(handAfter).toBe(handBefore);
    });
  });

  describe("SPIRIT OF GIVING - Whenever you use the Boost ability of a character, you may put the top card of your deck under them facedown", () => {
    it("should put the top card of the deck under the character when Boost is activated", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1, // Ursula has Boost 1 which costs 1 ink
        play: [donaldDuckFredHoneywell, ursulaWhisperOfVanessa],
        deck: 5,
      });

      const ursulaIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const ursulaId = ursulaIds.find(
        (id) => testEngine.getCardDefinitionId(id) === ursulaWhisperOfVanessa.id,
      );
      expect(ursulaId).toBeDefined();

      const cardsUnderBefore = testEngine.getCardsUnder(ursulaId!).length;

      // Activate Ursula's Boost ability (puts top card of deck under her)
      expect(
        testEngine.asPlayerOne().activateAbility(ursulaWhisperOfVanessa, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // After Boost activates, Ursula should have 1 card under her (from Boost itself)
      // SPIRIT OF GIVING then optionally puts another card under her
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(donaldDuckFredHoneywell),
        ).toBeSuccessfulCommand();
      }

      // Should have at least 2 cards under Ursula (1 from Boost + 1 from SPIRIT OF GIVING)
      const cardsUnderAfter = testEngine.getCardsUnder(ursulaId!).length;
      expect(cardsUnderAfter).toBeGreaterThan(cardsUnderBefore + 1);
    });

    it("should allow declining the optional extra card placement", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 1,
        play: [donaldDuckFredHoneywell, ursulaWhisperOfVanessa],
        deck: 5,
      });

      const ursulaIds = testEngine.getCardInstanceIdsInZone("play", PLAYER_ONE);
      const ursulaId = ursulaIds.find(
        (id) => testEngine.getCardDefinitionId(id) === ursulaWhisperOfVanessa.id,
      );
      expect(ursulaId).toBeDefined();

      // Activate Boost
      expect(
        testEngine.asPlayerOne().activateAbility(ursulaWhisperOfVanessa, { ability: "Boost" }),
      ).toBeSuccessfulCommand();

      // Decline SPIRIT OF GIVING
      const bagEffects = testEngine.asPlayerOne().getBagEffects();
      if (bagEffects.length > 0) {
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(donaldDuckFredHoneywell, { resolveOptional: false }),
        ).toBeSuccessfulCommand();
      }

      // Only 1 card under Ursula from Boost itself, no extra from SPIRIT OF GIVING
      const cardsUnderAfter = testEngine.getCardsUnder(ursulaId!).length;
      expect(cardsUnderAfter).toBe(1);
    });
  });
});
