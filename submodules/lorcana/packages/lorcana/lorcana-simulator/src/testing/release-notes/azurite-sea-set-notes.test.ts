// Source: .claude/skills/lorcana-rules/references/azurite-sea-release-notes/UNOFFICIAL_Azurite_Sea_Set_Notes_251019_160942.md
// Presented by LorcanaJudges.com

import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import type { KeywordAbilityDefinition } from "@tcg/lorcana-types";
import {
  captainAmeliaCommanderOfTheLegacy,
  daleMischievousRanger,
  genieWonderfulTrickster,
  hadesLordOfTheDead,
  johnSilverFerociousFriend,
  simbaPrideProtector,
  tadashiHamadaGiftedRoboticist,
  tianaRestaurantOwner,
  wreckitRalphHamHands,
  mosquitoBite,
  sailTheAzuriteSea,
  twinFire,
  microbots,
  scrump,
} from "@tcg/lorcana-cards/cards/006";
import { beastRelentless } from "@tcg/lorcana-cards/cards/002";

// === Mock Cards for Testing ===
const fillerCharacter = createMockCharacter({
  id: "rn-006-filler",
  name: "Filler Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const anotherFiller = createMockCharacter({
  id: "rn-006-another-filler",
  name: "Another Filler",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const thirdFiller = createMockCharacter({
  id: "rn-006-third-filler",
  name: "Third Filler",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const strongAttacker = createMockCharacter({
  id: "rn-006-strong-attacker",
  name: "Strong Attacker",
  cost: 4,
  strength: 4,
  willpower: 5,
});

const resistCharacter = createMockCharacter({
  id: "rn-006-resist-char",
  name: "Resist Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  abilities: [
    {
      type: "keyword",
      keyword: "Resist",
      value: 1,
      name: "Resist +1",
    } as KeywordAbilityDefinition,
  ],
});

const opponentItem = createMockItem({
  id: "rn-006-opponent-item",
  name: "Opponent Item",
  cost: 2,
});

const tankyDefender = createMockCharacter({
  id: "rn-006-tanky-defender",
  name: "Tanky Defender",
  cost: 3,
  strength: 2,
  willpower: 6,
});

describe("Azurite Sea Set Notes (Unofficial - LorcanaJudges.com)", () => {
  // ─── GENERAL RULES ────────────────────────────────────────────────────

  describe("General Rules", () => {
    describe("Activated abilities can be used multiple times", () => {
      it("should allow using an activated ability more than once if cost can be paid each time", () => {
        // Q: Can I use an activated ability more than once during my turn?
        // A: Yes, provided you can pay the cost associated with that ability.
        // Using Scrump: exert one of your characters to give chosen character -2 S.
        // With two ready characters, Scrump can be used twice.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [scrump, fillerCharacter, anotherFiller],
            deck: 2,
          },
          {
            play: [strongAttacker],
            deck: 2,
          },
        );

        const baseStrength = testEngine.asPlayerTwo().getCardStrength(strongAttacker);

        // First activation: exert fillerCharacter to weaken strongAttacker
        expect(
          testEngine.asPlayerOne().activateAbility(scrump, {
            costs: { exertCharacters: [fillerCharacter] },
            targets: [strongAttacker],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getCardStrength(strongAttacker)).toBe(baseStrength - 2);

        // Second activation: exert anotherFiller to weaken strongAttacker again
        expect(
          testEngine.asPlayerOne().activateAbility(scrump, {
            costs: { exertCharacters: [anotherFiller] },
            targets: [strongAttacker],
          }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getCardStrength(strongAttacker)).toBe(baseStrength - 4);
      });
    });

    describe("Simultaneous banishment triggers", () => {
      it.skip("should trigger Hades' SOUL COLLECTOR when another character is banished on opponent's turn", () => {
        // Hades: "SOUL COLLECTOR" - Whenever one of your other characters is banished
        // during the opponent's turn, gain 2 lore.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [strongAttacker],
            deck: 2,
          },
          {
            play: [hadesLordOfTheDead, { card: fillerCharacter, exerted: true }],
            deck: 2,
          },
        );

        const loreBefore = testEngine.getLore(PLAYER_TWO);

        // P1 challenges P2's filler (on P1's turn = opponent's turn for Hades)
        expect(
          testEngine.asPlayerOne().challenge(strongAttacker, fillerCharacter),
        ).toBeSuccessfulCommand();

        // Resolve Hades' trigger via bounded bag draining if this assertion ever needs to inspect it.

        // Hades should have gained 2 lore (one other character banished on opponent's turn)
        expect(testEngine.getLore(PLAYER_TWO)).toBe(loreBefore + 2);
      });
    });

    describe("Putting damage counters vs dealing damage", () => {
      it("should not trigger Resist when putting damage counters on a character", () => {
        // Already tested in section-08-resist.test.ts (8.8.3)
      });

      it("should not trigger Beast - Relentless when putting damage counters via Mosquito Bite", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [mosquitoBite],
            inkwell: mosquitoBite.cost,
          },
          {
            play: [beastRelentless],
          },
        );

        expect(
          testEngine.asPlayerOne().playCard(mosquitoBite, { targets: [beastRelentless] }),
        ).toBeSuccessfulCommand();

        // Put damage is not "dealt" damage - Beast's ability should NOT trigger
        expect(testEngine.asPlayerTwo().getDamage(beastRelentless)).toBe(1);
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      });
    });

    describe("Exert cost on non-character cards", () => {
      it("should require a dry character to pay exert cost on items/locations/actions (e.g., Scrump)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [scrump, { card: fillerCharacter, exerted: true }],
            deck: 2,
          },
          {
            play: [strongAttacker],
            deck: 2,
          },
        );

        // Attempt to use Scrump with an already-exerted character should fail
        const result = testEngine.asPlayerOne().activateAbility(scrump, {
          costs: { exertCharacters: [fillerCharacter] },
          targets: [strongAttacker],
        });

        expect(result.success).toBe(false);
      });
    });
  });

  // ─── SPECIFIC CHARACTERS ──────────────────────────────────────────────

  describe("Specific Characters", () => {
    describe("Captain Amelia - Commander of the Legacy", () => {
      it("should grant Resist +1 to other characters when THEY are challenged, not when Captain Amelia is challenged", () => {
        // Everything Shipshape: static ability granting Resist +1 to your other characters
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [captainAmeliaCommanderOfTheLegacy, { card: tankyDefender, exerted: true }],
            deck: 2,
          },
          {
            play: [strongAttacker],
            deck: 2,
          },
        );

        // P1 must pass turn so P2 has priority to challenge
        expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

        // P2 challenges the tanky defender (not Captain Amelia)
        expect(
          testEngine.asPlayerTwo().challenge(strongAttacker, tankyDefender),
        ).toBeSuccessfulCommand();

        // Tanky defender should take attacker.strength - 1 damage (Resist +1 from Amelia)
        expect(testEngine.asPlayerOne().getDamage(tankyDefender)).toBe(strongAttacker.strength - 1);
      });
    });

    describe("Dale - Mischievous Ranger", () => {
      it("should require exactly 3 cards in deck to pay Nuts About Pranks cost - cannot partially pay", () => {
        // Dale: "NUTS ABOUT PRANKS" - When played, may put top 3 cards of deck into discard
        // to give chosen character -3 S. Cannot partially pay (need exactly 3 cards).
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [daleMischievousRanger],
            inkwell: daleMischievousRanger.cost,
            deck: 2, // Only 2 cards - less than 3 required
          },
          {
            play: [strongAttacker],
            deck: 2,
          },
        );

        // Play Dale - the on-play trigger should fire
        expect(testEngine.asPlayerOne().playCard(daleMischievousRanger)).toBeSuccessfulCommand();

        const bagCount = testEngine.asPlayerOne().getBagCount();
        if (bagCount > 0) {
          const bagEffects = testEngine.asPlayerOne().getBagEffects();
          testEngine.asPlayerOne().resolvePendingByCard(bagEffects[0]!.sourceId, {
            resolveOptional: true,
            targets: [strongAttacker],
          });
        }

        // Strong attacker should not have -3 strength since cost couldn't be paid
        expect(testEngine.asPlayerTwo().getCardStrength(strongAttacker)).toBe(
          strongAttacker.strength,
        );
      });
    });

    describe("Genie - Wonderful Trickster", () => {
      it("should NOT trigger Your Reward Awaits when Genie is played", () => {
        // Genie: "YOUR REWARD AWAITS" - Whenever you play a card, draw a card
        // Genie is not in play when his own play trigger would fire.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [genieWonderfulTrickster],
            inkwell: genieWonderfulTrickster.cost,
            deck: 3,
          },
          {
            deck: 2,
          },
        );

        const zonesBefore = testEngine.asPlayerOne().getZonesCardCount();

        expect(testEngine.asPlayerOne().playCard(genieWonderfulTrickster)).toBeSuccessfulCommand();

        // No bag effects from Genie's own play
        expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

        // Hand should be empty (played the only card, no draw)
        const zonesAfter = testEngine.asPlayerOne().getZonesCardCount();
        expect(zonesAfter.hand).toBe(zonesBefore.hand - 1);
      });
    });

    describe("John Silver - Ferocious Friend", () => {
      it.skip("should NOT ready a character with Resist +1 if the 1 damage is fully resisted", () => {
        // John Silver: "YOU HAVE TO CHART YOUR OWN COURSE" - Whenever this character quests,
        // you may deal 1 damage to one of your other characters. If you do, ready that character.
        // "If you do" fails when Resist blocks all damage.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [
              { card: johnSilverFerociousFriend, isDrying: false },
              { card: resistCharacter, exerted: true },
            ],
            deck: 2,
          },
          {
            deck: 2,
          },
        );

        // Quest with John Silver
        expect(testEngine.asPlayerOne().quest(johnSilverFerociousFriend)).toBeSuccessfulCommand();

        // Resolve the bag effect: target the resist character
        if (testEngine.asPlayerOne().getBagCount() > 0) {
          const bagEffects = testEngine.asPlayerOne().getBagEffects();
          testEngine.asPlayerOne().resolvePendingByCard(bagEffects[0]!.sourceId, {
            resolveOptional: true,
            targets: [resistCharacter],
          });
        }

        // Resolve any remaining pending effects via bounded bag draining if this block is re-enabled.

        // Resist +1 blocks the 1 damage → "if you do" fails → character stays exerted
        expect(testEngine.asPlayerOne().getDamage(resistCharacter)).toBe(0);
        expect(testEngine.asPlayerOne().isExerted(resistCharacter)).toBe(true);
      });
    });

    describe("Lilo - Escape Artist", () => {
      it.todo("should be playable from the discard pile during Set Step without needing another copy in play", () => {});

      it.todo("should require paying ink cost when played from discard", () => {});

      it.todo("should enter play exerted when played from discard, preventing Stitch - Rock Star's exert trigger", () => {});
    });

    describe("Mr. Big - Shrewd Tycoon", () => {
      it.todo("should be challengeable by a 0 strength character with Challenger +3 despite Reputation", () => {});
    });

    describe("Peter Pan - Never Land Prankster", () => {
      it.todo("should allow Goofy - Super Goof to gain lore from Super Peanut Powers when challenging Peter Pan", () => {});
    });

    describe("Pleakley - Scientific Expert", () => {
      it.todo("should put himself into inkwell if no other characters are in play (Reporting for Duty is mandatory)", () => {});
    });

    describe("Scar - Heartless Hunter", () => {
      it.todo("should damage himself with Teeth and Ambitions when no other characters are in play (mandatory)", () => {});
    });

    describe("Simba - Pride Protector", () => {
      it("should ready ALL other characters when Understand the Balance is used - no picking and choosing", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [
              { card: simbaPrideProtector, exerted: true },
              { card: fillerCharacter, exerted: true },
              { card: anotherFiller, exerted: true },
              { card: thirdFiller, exerted: true },
            ],
            deck: 2,
          },
          {
            deck: 2,
          },
        );

        // Pass turn to trigger end-of-turn effect
        expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

        // Resolve the bag effect (accept the optional ability)
        const bagEffects = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(bagEffects[0]!.sourceId, { resolveOptional: true }),
        ).toBeSuccessfulCommand();

        // ALL other characters should be readied - no picking and choosing
        expect(testEngine.asPlayerOne().isExerted(fillerCharacter)).toBe(false);
        expect(testEngine.asPlayerOne().isExerted(anotherFiller)).toBe(false);
        expect(testEngine.asPlayerOne().isExerted(thirdFiller)).toBe(false);

        // Simba should still be exerted (readies OTHER characters, not self)
        expect(testEngine.asPlayerOne().isExerted(simbaPrideProtector)).toBe(true);
      });

      it("should resolve to no effect if Simba is not exerted when Understand the Balance resolves", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [
              { card: simbaPrideProtector, exerted: true },
              { card: fillerCharacter, exerted: true },
            ],
            deck: 2,
          },
          {
            deck: 2,
          },
        );

        // Pass turn - trigger fires
        expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
        expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);

        // Ready Simba before resolving the bag effect
        const simbaId = testEngine.findCardInstanceId(simbaPrideProtector, "play", PLAYER_ONE);
        testEngine.asServer().manualReadyCard(simbaId);
        expect(testEngine.asPlayerOne().isExerted(simbaPrideProtector)).toBe(false);

        // Resolve the bag effect - secondary condition fails
        const bagEffects = testEngine.asPlayerOne().getBagEffects();
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(bagEffects[0]!.sourceId, { resolveOptional: true });

        // Filler should still be exerted (ability had no effect)
        expect(testEngine.asPlayerOne().isExerted(fillerCharacter)).toBe(true);
      });
    });

    describe("Sisu - Uniting Dragon", () => {
      it.todo("should repeat ability until a non-Dragon is revealed (mandatory repeat)", () => {});
    });

    describe("Tiana - Restaurant Owner", () => {
      // Card definition fixed (trigger now correctly fires on "challenged" event).
      // However, test resolution hangs due to infinite bag loop — likely the
      // CHALLENGING_CHARACTER target resolution creates recursive triggers, or
      // the "unless pays 3 ink" mechanic needs engine support before the test can pass.
      it.todo("should stack -3 strength when multiple copies are in play", () => {});

      it.todo("should keep -3 strength on challenging character until End of Turn phase", () => {});
    });

    describe("Tadashi Hamada - Gifted Roboticist", () => {
      it("should always go to inkwell when banished on opponent's turn (mandatory second clause)", () => {
        // Tadashi: "SOMEONE HAS TO HELP" - During an opponent's turn, when banished,
        // you may put top card of deck into inkwell. Then, put this card into inkwell.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [strongAttacker],
            deck: 2,
          },
          {
            play: [{ card: tadashiHamadaGiftedRoboticist, exerted: true }],
            deck: 3,
          },
        );

        const p2InkBefore = testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO).length;

        // P1 challenges Tadashi (on P1's turn = opponent's turn for P2)
        expect(
          testEngine.asPlayerOne().challenge(strongAttacker, tadashiHamadaGiftedRoboticist),
        ).toBeSuccessfulCommand();

        // P2 resolves Tadashi's "SOMEONE HAS TO HELP" trigger:
        // - Decline the optional (don't put top of deck to inkwell)
        // - The mandatory "put this card into inkwell" executes automatically in the same resolution
        expect(
          testEngine
            .asPlayerTwo()
            .resolvePendingByCard(tadashiHamadaGiftedRoboticist, { resolveOptional: false }),
        ).toBeSuccessfulCommand();

        // Tadashi should be in inkwell (mandatory second clause)
        expect(testEngine.asPlayerTwo().getCardZone(tadashiHamadaGiftedRoboticist)).toBe("inkwell");

        // Ink count should have increased
        expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_TWO).length).toBeGreaterThan(
          p2InkBefore,
        );
      });
    });

    describe("Wreck-It Ralph - Ham Hands", () => {
      it("should be able to banish opponent's items or locations with Wreck Things", () => {
        // Ralph: "I WRECK THINGS" - Whenever this character quests, you may banish
        // chosen item or location to gain 2 lore.
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            play: [{ card: wreckitRalphHamHands, isDrying: false }],
            deck: 2,
          },
          {
            play: [opponentItem],
            deck: 2,
          },
        );

        const loreBefore = testEngine.getLore(PLAYER_ONE);

        // Quest with Ralph
        expect(testEngine.asPlayerOne().quest(wreckitRalphHamHands)).toBeSuccessfulCommand();

        // Resolve the optional ability
        expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
        const bagEffects = testEngine.asPlayerOne().getBagEffects();
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(bagEffects[0]!.sourceId, {
            resolveOptional: true,
            targets: [opponentItem],
          }),
        ).toBeSuccessfulCommand();

        // Resolve any pending target selection via bounded bag draining if this block is re-enabled.

        // Opponent's item should be banished
        expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");

        // Should have gained lore (Ralph's base lore + 2 from ability)
        expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + wreckitRalphHamHands.lore + 2);
      });
    });
  });

  // ─── SPECIFIC ACTIONS/SONGS ───────────────────────────────────────────

  describe("Specific Actions/Songs", () => {
    describe("Sail the Azurite Sea", () => {
      it("should require inkable cards for the additional ink action", () => {
        // Already covered in section-04-02.test.ts (4.2.3.1)
      });

      it("should draw a card before allowing the additional ink action (resolve fully first)", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [sailTheAzuriteSea],
            inkwell: sailTheAzuriteSea.cost,
            deck: 3,
          },
          {
            deck: 2,
          },
        );

        const zonesBefore = testEngine.asPlayerOne().getZonesCardCount();

        expect(testEngine.asPlayerOne().playCard(sailTheAzuriteSea)).toBeSuccessfulCommand();

        // After resolving, a card should have been drawn
        const zonesAfter = testEngine.asPlayerOne().getZonesCardCount();
        // Hand went from 1 (sail) → 0 (played) → +1 (drew) = 1
        expect(zonesAfter.hand).toBe(1);
        expect(zonesAfter.deck).toBe(zonesBefore.deck - 1);
      });
    });

    describe("Twin Fire", () => {
      it("should NOT allow dealing both instances of 2 damage to the same character", () => {
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [twinFire, sailTheAzuriteSea], // sailTheAzuriteSea as discard fodder
            inkwell: twinFire.cost,
          },
          {
            play: [strongAttacker, fillerCharacter],
          },
        );

        // Play Twin Fire, targeting strongAttacker for the first 2 damage
        expect(
          testEngine.asPlayerOne().playCard(twinFire, { targets: [strongAttacker] }),
        ).toBeSuccessfulCommand();

        expect(testEngine.asPlayerTwo().getDamage(strongAttacker)).toBe(2);

        // Discard a card and deal 2 damage to ANOTHER character (must be different target)
        const result = testEngine.asPlayerOne().resolvePendingEffect(twinFire, {
          resolveOptional: true,
          targets: [sailTheAzuriteSea, fillerCharacter],
        });
        expect(result.success).toBe(true);

        // Filler should have 2 damage (second target)
        expect(testEngine.asPlayerTwo().getDamage(fillerCharacter)).toBe(2);
        // strongAttacker should still only have 2 damage from first hit
        expect(testEngine.asPlayerTwo().getDamage(strongAttacker)).toBe(2);
      });
    });
  });

  // ─── SPECIFIC ITEMS ───────────────────────────────────────────────────

  describe("Specific Items", () => {
    describe("Maleficent's Staff", () => {
      it.todo("should NOT trigger Back Fools when a character is returned to hand from discard (after banishment)", () => {});
    });

    describe("Microbots", () => {
      it("should count the copy that was played when resolving Inspired Tech", () => {
        // Microbots: "INSPIRED TECH" - When you play this item, chosen character gets
        // -1 S this turn for each item named Microbots you have in play
        const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
          {
            hand: [microbots],
            inkwell: microbots.cost,
            play: [microbots], // One already in play
            deck: 2,
          },
          {
            play: [strongAttacker],
            deck: 2,
          },
        );

        const baseStrength = testEngine.asPlayerTwo().getCardStrength(strongAttacker);
        const microbotsInHand = testEngine.findCardInstanceId(microbots, "hand", "p1");

        // Play second Microbots
        expect(testEngine.asPlayerOne().playCard(microbotsInHand)).toBeSuccessfulCommand();

        // Resolve Inspired Tech
        expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
        expect(
          testEngine
            .asPlayerOne()
            .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
        ).toBeSuccessfulCommand();
        expect(
          testEngine.asPlayerOne().resolveNextPending({
            targets: [strongAttacker],
          }),
        ).toBeSuccessfulCommand();

        // Should count BOTH copies (the one already in play + the one just played) = -2 strength
        expect(testEngine.asPlayerTwo().getCardStrength(strongAttacker)).toBe(baseStrength - 2);
      });
    });

    describe("Transport Pod", () => {
      it.todo("should allow moving character to The Queen's Castle before Using the Mirror resolves", () => {});

      it.todo("should NOT allow moving a Pirate to Skull Rock for Safe Haven lore (secondary condition checked at start of turn)", () => {});
    });
  });

  // ─── SPECIFIC LOCATIONS ───────────────────────────────────────────────

  describe("Specific Locations", () => {
    describe("Owl Island - Secluded Entrance", () => {
      it.todo("should NOT discount next action if Owl Island is played after an action was already played", () => {});

      it.todo("should consume Teamwork discount when singing a song (even though no benefit)", () => {});
    });

    describe("Sugar Rush Speedway - Finish Line", () => {
      it.todo("should still move character to location even if damage from On Your Marks would banish them", () => {});
    });

    describe("Treasure Mountain - Azurite Sea Island", () => {
      it.todo("should force damage to own characters/locations if opponent has nothing to target (mandatory)", () => {});
    });
  });
});
