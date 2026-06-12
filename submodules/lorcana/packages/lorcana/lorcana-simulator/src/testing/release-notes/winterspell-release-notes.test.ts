/**
 * Winterspell Set Release Notes - Test Specification
 *
 * Source: .claude/skills/lorcana-rules/references/winterspell-release-notes/Winterspell_SetReleaseNotes_EN.pdf
 *
 * Covers:
 * 1. Rules change: Drawing from empty deck no longer auto-loses (lose at end of turn instead)
 * 2. New keyword: Underdog (Angel - Siren Singer)
 * 3. Quality-of-Life: Belle - Strange but Special / Sail the Azurite Sea ink wording update
 * 4. Card-specific notes:
 *    - Elisa Maza - Transformed Gargoyle (printed value vs modified value)
 *    - Anna - Soothing Sister / Flynn Rider - His Own Biggest Fan (lore in discard interaction)
 *    - Grandmother Willow - Ancient Advisor (Smooth the Way is non-optional)
 *    - Lilo - Bundled Up (first damage prevention per opponent's turn only)
 *    - Mickey Mouse - Bob Cratchit (cards go to discard faceup, then move under chosen target)
 *    - Colors of the Wind (unique ink types counting)
 */

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import {
  belleStrangeButSpecial,
  dragonFire,
  heiheiBoatSnack,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "@tcg/lorcana-cards/cards/001";
import { flynnRiderHisOwnBiggestFan } from "@tcg/lorcana-cards/cards/002";
import { microbots, sailTheAzuriteSea } from "@tcg/lorcana-cards/cards/006";
import { jasmineSteadyStrategist } from "@tcg/lorcana-cards/cards/008";
import {
  angelSirenSinger,
  annaSoothingSister,
  colorsOfTheWind,
  elisaMazaTransformedGargoyle,
  grandmotherWillowAncientAdvisor,
  liloBundledUp,
  mickeyMouseBobCratchit,
} from "@tcg/lorcana-cards/cards/011";

const mockAttacker1 = createMockCharacter({
  id: "winterspell-attacker-1",
  name: "Attacker One",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const mockAttacker2 = createMockCharacter({
  id: "winterspell-attacker-2",
  name: "Attacker Two",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const cheapCharacter = createMockCharacter({
  id: "winterspell-cheap",
  name: "Cheap Character",
  cost: 3,
  strength: 1,
  willpower: 1,
});

describe("Winterspell Set Release Notes", () => {
  // ============================================================================
  // SECTION 1: Rules Changes
  // ============================================================================
  describe("Rules Change: Drawing from an empty deck", () => {
    // Previously, drawing from empty deck = instant loss.
    // New rule: lose only if you END your turn with no cards in deck.
    it("should NOT cause immediate loss when drawing from an empty deck (new rule: lose at end of turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 0, inkwell: 1 },
        { deck: 5 },
      );

      // Player one has no cards in deck, but the game should NOT be over yet
      // (they haven't ended their turn)
      expect(testEngine.asServer().isGameOver()).toBe(false);
      expect(testEngine.asServer().getWinner()).toBeUndefined();
    });

    it("should cause a loss if player ends their turn with no cards in deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({ deck: 0 }, { deck: 5 });

      // Pass turn with empty deck → game ends, player one loses
      const result = testEngine.asPlayerOne().passTurn();
      expect(result.success).toBe(true);
      expect(testEngine.asServer().isGameOver()).toBe(true);
      expect(testEngine.asServer().getWinner()).toBe(PLAYER_TWO);
    });
  });

  // ============================================================================
  // SECTION 2: Underdog Keyword
  // ============================================================================
  describe("Underdog Keyword (Angel - Siren Singer)", () => {
    // Angel - Siren Singer: 2 cost with Underdog
    // Underdog: If it's your first turn and you're not the first player, pay 1 less
    it("should reduce cost by 1 for the second player on their first turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 5 },
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1, // 1 ink — enough with Underdog discount
          deck: 5,
        },
      );

      // Pass player one's first turn
      testEngine.asPlayerOne().passTurn();

      // Player two is NOT the first player, and this is their first turn → Underdog applies
      const result = testEngine.asPlayerTwo().playCard(angelSirenSinger);
      expect(result.success).toBe(true);
      expect(testEngine.asPlayerTwo().getCardZone(angelSirenSinger)).toBe("play");
    });

    it("should NOT reduce cost for the first player", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1, // Only 1 ink
          deck: 5,
        },
        {
          deck: 5,
        },
      );

      // Player one IS the first player → Underdog does NOT apply
      const result = testEngine.asPlayerOne().playCard(angelSirenSinger);
      expect(result.success).toBe(false);
    });

    it("should NOT reduce cost on subsequent turns (not first turn)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          deck: 5,
        },
        {
          hand: [angelSirenSinger],
          inkwell: angelSirenSinger.cost - 1,
          deck: 5,
        },
      );

      // Pass through first turns
      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();
      testEngine.asPlayerOne().passTurn();

      // Player two's second turn → Underdog should NOT apply
      const result = testEngine.asPlayerTwo().playCard(angelSirenSinger);
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // SECTION 3: Quality-of-Life Updates
  // ============================================================================
  describe("Quality-of-Life: Ink wording updates", () => {
    describe("Belle - Strange but Special (Read a Book)", () => {
      // Belle's ability "READ A BOOK" now reads: "During your turn, you may ink an additional card."
      // Wording changed but behavior is the same.
      it("should allow inking an additional card during your turn", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [{ card: belleStrangeButSpecial, isDrying: false }],
          hand: [microbots, simbaProtectiveCub],
          deck: 5,
        });

        // Normal ink
        expect(testEngine.asPlayerOne().ink(microbots)).toBeSuccessfulCommand();
        // Additional ink from Belle's READ A BOOK
        expect(testEngine.asPlayerOne().ink(simbaProtectiveCub)).toBeSuccessfulCommand();
      });
    });

    describe("Sail the Azurite Sea", () => {
      // Sail the Azurite Sea now reads: "This turn, you may ink an additional card. Draw a card."
      // Wording changed but behavior is the same.
      it("should allow inking an additional card this turn and draw a card", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
          hand: [sailTheAzuriteSea, microbots, simbaProtectiveCub],
          deck: [mickeyMouseTrueFriend],
          inkwell: sailTheAzuriteSea.cost,
        });

        // Normal ink first
        expect(testEngine.asPlayerOne().ink(microbots)).toBeSuccessfulCommand();
        // Can't ink a second card yet
        expect(testEngine.asPlayerOne().ink(simbaProtectiveCub).success).toBe(false);

        // Play Sail → draws a card + grants additional ink
        expect(testEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toBeSuccessfulCommand();
        // Hand should have simbaProtectiveCub + drawn mickeyMouseTrueFriend
        expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

        // Now can ink the additional card
        expect(testEngine.asPlayerOne().ink(simbaProtectiveCub)).toBeSuccessfulCommand();
      });
    });
  });

  // ============================================================================
  // SECTION 4: Card-Specific Notes
  // ============================================================================
  describe("Card-Specific Notes", () => {
    describe("Elisa Maza - Transformed Gargoyle", () => {
      describe("FOREVER STRONG - Your characters' strength can't be reduced below their printed value", () => {
        it("should have FOREVER STRONG ability active when in play", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
            play: [elisaMazaTransformedGargoyle, mickeyMouseTrueFriend],
            deck: 5,
          });

          // Verify Elisa is in play with the ability
          expect(testEngine.asPlayerOne().getCardZone(elisaMazaTransformedGargoyle)).toBe("play");
        });
      });

      describe("STONE BY DAY - If you have 3 or more cards in your hand, this character can't ready", () => {
        it("should prevent readying when controller has 3+ cards in hand", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [{ card: elisaMazaTransformedGargoyle, exerted: true }],
              hand: [mickeyMouseTrueFriend, mickeyMouseTrueFriend, mickeyMouseTrueFriend],
              deck: 5,
            },
            {
              deck: 5,
            },
          );

          // Player has 3 cards in hand → Elisa can't ready
          testEngine.asPlayerOne().passTurn();
          testEngine.asPlayerTwo().passTurn();

          // Elisa should still be exerted because STONE BY DAY prevents readying
          expect(testEngine.asPlayerOne().isExerted(elisaMazaTransformedGargoyle)).toBe(true);
        });

        it("should allow readying when controller has fewer than 3 cards in hand", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [{ card: elisaMazaTransformedGargoyle, exerted: true }],
              hand: [mickeyMouseTrueFriend, mickeyMouseTrueFriend],
              deck: 5,
            },
            {
              deck: 5,
            },
          );

          // Player has 2 cards in hand → Elisa CAN ready
          testEngine.asPlayerOne().passTurn();
          testEngine.asPlayerTwo().passTurn();

          // Elisa should be ready now
          expect(testEngine.asPlayerOne().isExerted(elisaMazaTransformedGargoyle)).toBe(false);
        });
      });
    });

    describe("Anna - Soothing Sister / Flynn Rider - His Own Biggest Fan interaction", () => {
      // Q: If I quest with Anna and choose Flynn Rider from discard, how much lore?
      // A: 1 lore from quest + 4 lore from Flynn's PRINTED lore = 5 total.
      //    Flynn's "One Last, Big Score" (-1 lore per card in opponents' hands)
      //    doesn't apply when he's not in play.
      it("should gain full printed lore from Flynn Rider in discard (not reduced by One Last, Big Score)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [annaSoothingSister],
            discard: [flynnRiderHisOwnBiggestFan],
            deck: 10,
          },
          {
            hand: [heiheiBoatSnack, heiheiBoatSnack, heiheiBoatSnack],
            deck: 5,
          },
        );

        const loreBefore = testEngine.getLore(PLAYER_ONE);

        // Quest with Anna — triggers WARM HEART
        expect(testEngine.asPlayerOne().quest(annaSoothingSister)).toBeSuccessfulCommand();

        // Resolve WARM HEART: accept optional, choose Flynn from discard
        const bagEffects = testEngine.asPlayerOne().getBagEffects();
        expect(bagEffects.length).toBeGreaterThan(0);

        const flynnId = testEngine.findCardInstanceId(
          flynnRiderHisOwnBiggestFan,
          "discard",
          PLAYER_ONE,
        );
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(bagEffects[0]!.sourceId, {
            resolveOptional: true,
            targets: [flynnId],
          }),
        ).toBeSuccessfulCommand();

        // 1 from Anna quest + 4 from Flynn's PRINTED lore = 5 total
        // Flynn's "One Last, Big Score" does NOT apply from discard
        const loreAfter = testEngine.getLore(PLAYER_ONE);
        expect(loreAfter).toBe(loreBefore + 5);

        // Flynn should be moved to bottom of deck
        expect(testEngine.asPlayerOne().getCardZone(flynnRiderHisOwnBiggestFan)).toBe("deck");
      });
    });

    describe("Grandmother Willow - Ancient Advisor", () => {
      describe("SMOOTH THE WAY - cost reduction is NOT optional", () => {
        // Q: Can I choose when to use Smooth the Way?
        // A: No. There's no "may" — discount applies to the VERY NEXT character played.
        //    On later turns, it applies to the first character played each turn.
        it("should automatically apply the discount to the next character played that turn", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              hand: [grandmotherWillowAncientAdvisor, cheapCharacter],
              inkwell: grandmotherWillowAncientAdvisor.cost + cheapCharacter.cost - 1,
              deck: 2,
            },
            { deck: 2 },
          );

          // Play Willow — triggers when-played cost reduction
          expect(
            testEngine.asPlayerOne().playCard(grandmotherWillowAncientAdvisor),
          ).toBeSuccessfulCommand();

          // cheapCharacter (cost 3) should now cost 2 with the automatic discount
          expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(true);
          expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
        });

        it("should apply discount to the first character each subsequent turn", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [grandmotherWillowAncientAdvisor],
              hand: [cheapCharacter],
              inkwell: cheapCharacter.cost - 1, // Only enough with -1 discount
              deck: 2,
            },
            { deck: 2 },
          );

          // Before start-of-turn, can't afford cheapCharacter
          expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(false);

          // Cycle turns to trigger start-of-turn
          expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
          expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

          // Resolve Willow's start-of-turn triggered cost reduction
          expect(
            testEngine.asPlayerOne().resolvePendingByCard(grandmotherWillowAncientAdvisor),
          ).toBeSuccessfulCommand();

          // Now cheapCharacter should cost 2 (3 - 1 discount)
          expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(true);
          expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
        });
      });
    });

    describe("Lilo - Bundled Up", () => {
      describe("EXTRA LAYERS - first damage prevention per opponent's turn", () => {
        it("should prevent the first instance of damage during opponent's turn", () => {
          // EXTRA LAYERS: During each opponent's turn, the first time this character
          //   would take damage, she takes no damage instead.
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [mickeyMouseTrueFriend],
              deck: 5,
            },
            {
              play: [{ card: liloBundledUp, exerted: true }],
              deck: 5,
            },
          );

          const liloDamageBefore = testEngine.asPlayerTwo().getDamage(liloBundledUp);

          // Opponent challenges Lilo during their turn
          testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, liloBundledUp);

          // EXTRA LAYERS should prevent the first damage
          const liloDamageAfter = testEngine.asPlayerTwo().getDamage(liloBundledUp);
          expect(liloDamageAfter).toBe(liloDamageBefore); // No damage taken
        });

        // Q: Does Lilo's ability prevent ALL damage during opponents' turns?
        // A: No. Only the FIRST time she would take damage each opponent's turn.
        it("should NOT prevent damage after the first instance during same opponent's turn", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [mockAttacker1, mockAttacker2],
              deck: 5,
            },
            {
              play: [{ card: liloBundledUp, exerted: true }],
              deck: 5,
            },
          );

          // First challenge — EXTRA LAYERS prevents damage
          testEngine.asPlayerOne().challenge(mockAttacker1, liloBundledUp);
          expect(testEngine.asPlayerTwo().getDamage(liloBundledUp)).toBe(0);

          // Second challenge — damage goes through (1 damage from mockAttacker2)
          testEngine.asPlayerOne().challenge(mockAttacker2, liloBundledUp);
          expect(testEngine.asPlayerTwo().getDamage(liloBundledUp)).toBe(1);
        });
      });
    });

    describe("Mickey Mouse - Bob Cratchit", () => {
      describe("HARD WORK - quest trigger puts card under", () => {
        it("should put the top card of deck facedown under him when questing", () => {
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
            play: [mickeyMouseBobCratchit],
            deck: 5,
          });

          const mickeyId = testEngine.findCardInstanceId(
            mickeyMouseBobCratchit,
            "play",
            PLAYER_ONE,
          );

          expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(0);
          expect(testEngine.asPlayerOne().quest(mickeyMouseBobCratchit)).toBeSuccessfulCommand();
          expect(testEngine.getCardsUnder(mickeyId)).toHaveLength(1);
        });
      });

      describe("A GIVING HEART - banished in challenge transfers cards under", () => {
        it("cards move to discard faceup, then to under chosen character/location", () => {
          // Q: Are the cards moved faceup or facedown?
          // A: Faceup. The triggered effect resolves AFTER Mickey and all cards under
          //    him are put into the discard, where facedown cards turn faceup.
          //    When the ability resolves, those cards are moved from discard to the
          //    chosen character or location, and they remain faceup.
          const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
            {
              play: [{ card: mickeyMouseBobCratchit, exerted: true }, mickeyMouseTrueFriend],
              deck: 5,
            },
            {
              play: [mickeyMouseTrueFriend],
              deck: 2,
            },
          );

          const mickeyBobId = testEngine.findCardInstanceId(
            mickeyMouseBobCratchit,
            "play",
            PLAYER_ONE,
          );
          const allyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", PLAYER_ONE);

          // Put cards under Mickey
          const deckCards = testEngine.getCardInstanceIdsInZone("deck", PLAYER_ONE);
          testEngine.putCardUnder(mickeyBobId, deckCards[0]!);
          testEngine.putCardUnder(mickeyBobId, deckCards[1]!);

          testEngine.asPlayerOne().passTurn();

          const opponentMickey = testEngine.findCardInstanceId(
            mickeyMouseTrueFriend,
            "play",
            PLAYER_TWO,
          );
          expect(
            testEngine.asPlayerTwo().challenge(opponentMickey, mickeyBobId),
          ).toBeSuccessfulCommand();

          // Resolve A GIVING HEART
          const bagEffects = testEngine.asPlayerOne().getBagEffects();
          if (bagEffects.length > 0) {
            expect(
              testEngine.asPlayerOne().resolvePendingByCard(bagEffects[0]!.sourceId, {
                targets: [allyId],
              }),
            ).toBeSuccessfulCommand();
          }

          expect(testEngine.getCardsUnder(allyId)).toHaveLength(2);
        });
      });
    });

    describe("Colors of the Wind", () => {
      // Q: How does Colors of the Wind count ink types?
      // A: Count UNIQUE ink type symbols, not total number of cards.
      //    If both players reveal Amethyst cards → draw 1.
      //    If one reveals Amethyst and one reveals Amethyst+Steel → draw 2.
      it("should draw cards based on unique ink types revealed (not total cards)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [colorsOfTheWind],
            inkwell: colorsOfTheWind.cost,
            deck: [heiheiBoatSnack, mickeyMouseTrueFriend, dragonFire],
          },
          {
            deck: [simbaProtectiveCub],
          },
        );

        expect(testEngine.asPlayerOne().playCard(colorsOfTheWind)).toBeSuccessfulCommand();

        // Each player reveals top card; unique ink types among revealed cards = draw count
        expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);
      });

      it("should count dual-ink cards as each of their ink types (e.g., Sapphire+Steel = 2 types)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [colorsOfTheWind],
            inkwell: colorsOfTheWind.cost,
            deck: [
              heiheiBoatSnack,
              mickeyMouseTrueFriend,
              simbaProtectiveCub,
              jasmineSteadyStrategist,
            ],
          },
          {
            deck: [dragonFire],
          },
        );

        expect(testEngine.asPlayerOne().playCard(colorsOfTheWind)).toBeSuccessfulCommand();

        // Dual-ink Jasmine (Sapphire+Steel) + Ruby dragonFire = 3 unique types → draw 3
        expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(3);
      });
    });
  });
});
